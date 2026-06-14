'use client'

import { create } from 'zustand'
import { supabaseClient } from './supabase/client'
import { useAuthStore } from './auth-store'
import type { FeatureType } from './credits'

// ============================================
// REACTIVE CREDIT STORE
// ============================================
// Automatically syncs credit balance across all components
// No need to refresh or reload after credit operations

interface CreditState {
  balance: number
  used: number
  total: number
  loading: boolean
  error: string | null

  // Actions
  fetchBalance: (userId: string) => Promise<void>
  deductCredits: (userId: string, feature: FeatureType, description?: string) => Promise<{ success: boolean; error?: string }>
  addCredits: (userId: string, amount: number, description?: string) => Promise<{ success: boolean; error?: string }>
  initializeWallet: (userId: string, startingCredits?: number) => Promise<{ success: boolean; error?: string }>
}

export const useCreditsStore = create<CreditState>((set, get) => ({
  balance: 0,
  used: 0,
  total: 0,
  loading: false,
  error: null,

  fetchBalance: async (userId: string) => {
    if (!supabaseClient) {
      set({ balance: 0, used: 0, total: 0, loading: false })
      return
    }

    try {
      set({ loading: true, error: null })
      
      const { data: wallet, error } = await supabaseClient
        .from('credits')
        .select('remaining, used')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) {
        console.error('Fetch balance error:', error)
        set({ error: 'Failed to fetch balance', loading: false })
        return
      }

      if (!wallet) {
        set({ balance: 0, used: 0, total: 0, loading: false })
        return
      }

      const remaining = wallet.remaining || 0
      const usedAmount = wallet.used || 0

      set({
        balance: remaining,
        used: usedAmount,
        total: remaining + usedAmount,
        loading: false,
        error: null
      })

      // Also update the auth store's user.credits for consistency
      const authUser = useAuthStore.getState().user
      if (authUser && authUser.credits !== remaining) {
        useAuthStore.setState({
          user: { ...authUser, credits: remaining, updated_at: new Date().toISOString() }
        })
      }
    } catch (err) {
      console.error('Fetch balance error:', err)
      set({ error: 'Failed to fetch balance', loading: false })
    }
  },

  deductCredits: async (userId: string, feature: FeatureType, description?: string) => {
    if (!supabaseClient) {
      return { success: false, error: 'Supabase not configured' }
    }

    try {
      const state = get()
      const requiredCredits = getCreditCost(feature)

      if (state.balance < requiredCredits) {
        return { success: false, error: `Insufficient credits. Need ${requiredCredits}, have ${state.balance}.` }
      }

      const balanceBefore = state.balance
      const balanceAfter = balanceBefore - requiredCredits

      // Update wallet in database
      const { error: updateError } = await supabaseClient
        .from('credits')
        .update({
          remaining: balanceAfter,
          used: (state.used || 0) + requiredCredits
        })
        .eq('user_id', userId)

      if (updateError) {
        return { success: false, error: `Failed to deduct: ${updateError.message}` }
      }

      // Create transaction record
      await supabaseClient
        .from('transactions')
        .insert({
          user_id: userId,
          transaction_type: 'usage',
          credits: requiredCredits,
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          description: description || `Used for ${feature}`,
          reference_type: 'feature',
          reference_id: feature
        })

      // Update local state immediately
      set({
        balance: balanceAfter,
        used: (state.used || 0) + requiredCredits,
        error: null
      })

      // Update auth store user credits
      const authUser = useAuthStore.getState().user
      if (authUser) {
        useAuthStore.setState({
          user: { ...authUser, credits: balanceAfter, updated_at: new Date().toISOString() }
        })
      }

      return { success: true }
    } catch (err: any) {
      console.error('Deduct credits error:', err)
      return { success: false, error: err?.message || 'Failed to deduct credits' }
    }
  },

  addCredits: async (userId: string, amount: number, description?: string) => {
    if (!supabaseClient) {
      return { success: false, error: 'Supabase not configured' }
    }

    try {
      const state = get()
      const balanceBefore = state.balance
      const balanceAfter = balanceBefore + amount

      // Upsert wallet
      const { error: upsertError } = await supabaseClient
        .from('credits')
        .upsert({
          user_id: userId,
          amount: state.total + amount,
          used: state.used,
          remaining: balanceAfter,
        }, { onConflict: 'user_id' })

      if (upsertError) {
        return { success: false, error: `Failed to add: ${upsertError.message}` }
      }

      // Create transaction
      await supabaseClient
        .from('transactions')
        .insert({
          user_id: userId,
          transaction_type: 'purchase',
          credits: amount,
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          description: description || `${amount} credits added`,
          reference_type: 'purchase'
        })

      // Update local state
      set({
        balance: balanceAfter,
        total: state.total + amount,
        error: null
      })

      // Update auth store
      const authUser = useAuthStore.getState().user
      if (authUser) {
        useAuthStore.setState({
          user: { ...authUser, credits: balanceAfter, updated_at: new Date().toISOString() }
        })
      }

      return { success: true }
    } catch (err: any) {
      console.error('Add credits error:', err)
      return { success: false, error: err?.message || 'Failed to add credits' }
    }
  },

  initializeWallet: async (userId: string, startingCredits: number = 0) => {
    if (!supabaseClient) {
      return { success: false, error: 'Supabase not configured' }
    }

    try {
      const { error: upsertError } = await supabaseClient
        .from('credits')
        .upsert({
          user_id: userId,
          amount: startingCredits,
          used: 0,
          remaining: startingCredits,
        }, { onConflict: 'user_id' })

      if (upsertError) {
        return { success: false, error: `Failed to create wallet: ${upsertError.message}` }
      }

      // Log transaction
      await supabaseClient
        .from('transactions')
        .insert({
          user_id: userId,
          transaction_type: 'bonus',
          credits: startingCredits,
          balance_before: 0,
          balance_after: startingCredits,
          description: 'Welcome credits for new account',
          reference_type: 'signup'
        })

      set({
        balance: startingCredits,
        used: 0,
        total: startingCredits,
        error: null
      })

      return { success: true }
    } catch (err: any) {
      console.error('Initialize wallet error:', err)
      return { success: false, error: err?.message || 'Failed to initialize wallet' }
    }
  }
}))

// Helper function (copied from credits.ts to avoid circular imports)
function getCreditCost(feature: FeatureType): number {
  const CREDIT_COSTS: Record<string, number> = {
    'startup-judge': 20, 'startup-roast': 20, 'death-scanner': 20,
    'success-predictor': 20, 'competitor-scanner': 20, 'startup-valuator': 20,
    'business-model-analyzer': 20, 'moat-analyzer': 20,
    'founder-dna': 20, 'founder-score': 20, 'founder-weakness-scanner': 20,
    'leadership-analyzer': 20, 'founder-readiness': 20, 'founder-gps': 20,
    'founder-roadmap': 20,
    'opportunity-finder': 20, 'market-gap-scanner': 20, 'trend-detector': 20,
    'niche-discovery': 20, 'opportunity-radar': 20, 'side-hustle-finder': 20,
    'income-roadmap': 20,
    'instagram-analyzer': 20, 'youtube-analyzer': 20, 'linkedin-analyzer': 20,
    'telegram-analyzer': 20, 'x-analyzer': 20,
    'instagram-judge': 20, 'youtube-judge': 20, 'linkedin-judge': 20,
    'telegram-judge': 20, 'x-judge': 20,
    'product-advisor': 20, 'growth-advisor': 20, 'finance-advisor': 20,
    'legal-advisor': 20,
    'ai-client-finder': 20,
  }
  return CREDIT_COSTS[feature] || 20
}