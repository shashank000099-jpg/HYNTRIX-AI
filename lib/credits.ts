'use client'

import { supabaseClient } from './supabase/client'

// ============================================
// CENTRALIZED CREDIT ENGINE
// ============================================
// credits table = single wallet (1 row per user, UNIQUE(user_id))
// transactions table = audit trail of all credit movements

export const CREDIT_COSTS = {
  // All Features — 20 credits each
  'startup-judge': 20,
  'startup-roast': 20,
  'death-scanner': 20,
  'success-predictor': 20,
  'competitor-scanner': 20,
  'startup-valuator': 20,
  'business-model-analyzer': 20,
  'moat-analyzer': 20,
  'founder-dna': 20,
  'founder-score': 20,
  'founder-weakness-scanner': 20,
  'leadership-analyzer': 20,
  'founder-readiness': 20,
  'founder-gps': 20,
  'founder-roadmap': 20,
  'opportunity-finder': 20,
  'market-gap-scanner': 20,
  'trend-detector': 20,
  'niche-discovery': 20,
  'opportunity-radar': 20,
  'side-hustle-finder': 20,
  'income-roadmap': 20,
  'instagram-analyzer': 20,
  'youtube-analyzer': 20,
  'linkedin-analyzer': 20,
  'telegram-analyzer': 20,
  'x-analyzer': 20,
  'instagram-judge': 20,
  'youtube-judge': 20,
  'linkedin-judge': 20,
  'telegram-judge': 20,
  'x-judge': 20,
  'product-advisor': 20,
  'growth-advisor': 20,
  'finance-advisor': 20,
  'legal-advisor': 20,
  'ai-client-finder': 20,
} as const

export type FeatureType = keyof typeof CREDIT_COSTS

export interface CreditCheckResult {
  hasEnough: boolean
  currentCredits: number
  requiredCredits: number
  shortage: number
}

export interface CreditUsageResult {
  success: boolean
  error?: string
  remainingCredits?: number
  creditsUsed?: number
}

// ============================================
// WALLET OPERATIONS
// ============================================

/**
 * Get wallet balance for a user
 * Always reads from the single credits row
 */
export async function getWallet(userId: string): Promise<{ credits: number; used: number; total: number }> {
  if (!supabaseClient) {
    return { credits: 0, used: 0, total: 0 }
  }

  try {
    // Read from the wallet (single credits row per user)
    const { data: wallet, error } = await supabaseClient
      .from('credits')
      .select('remaining, used')
      .eq('user_id', userId)
      .maybeSingle()

    if (error || !wallet) {
      return { credits: 0, used: 0, total: 0 }
    }

    return {
      credits: wallet.remaining || 0,
      used: wallet.used || 0,
      total: (wallet.remaining || 0) + (wallet.used || 0)
    }
  } catch (err) {
    console.error('Get wallet error:', err)
    return { credits: 0, used: 0, total: 0 }
  }
}

/**
 * Check if user has enough credits for a feature
 * Uses the wallet (single credits row)
 */
export async function checkCredits(userId: string, feature: FeatureType): Promise<CreditCheckResult> {
  const requiredCredits = CREDIT_COSTS[feature]

  if (!supabaseClient) {
    return { hasEnough: false, currentCredits: 0, requiredCredits, shortage: requiredCredits }
  }

  try {
    const wallet = await getWallet(userId)
    const currentCredits = wallet.credits
    const hasEnough = currentCredits >= requiredCredits
    const shortage = Math.max(0, requiredCredits - currentCredits)

    return { hasEnough, currentCredits, requiredCredits, shortage }
  } catch (err) {
    console.error('Credit check error:', err)
    return { hasEnough: false, currentCredits: 0, requiredCredits, shortage: requiredCredits }
  }
}

/**
 * Deduct credits when a feature is used
 * Updates the single wallet row + creates a transaction record
 */
export async function deductCredits(userId: string, feature: FeatureType, description?: string): Promise<CreditUsageResult> {
  if (!supabaseClient) {
    return { success: false, error: 'Supabase not configured' }
  }

  try {
    const requiredCredits = CREDIT_COSTS[feature]

    // Check current balance
    const wallet = await getWallet(userId)
    
    if (wallet.credits < requiredCredits) {
      return {
        success: false,
        error: `Insufficient credits. You need ${requiredCredits} credits but only have ${wallet.credits}.`
      }
    }

    const balanceBefore = wallet.credits
    const balanceAfter = balanceBefore - requiredCredits

    // Update the wallet (single row per user)
    const { error: updateError } = await supabaseClient
      .from('credits')
      .update({
        remaining: balanceAfter,
        used: (wallet.used || 0) + requiredCredits
      })
      .eq('user_id', userId)

    if (updateError) {
      return { success: false, error: `Failed to deduct credits: ${updateError.message}` }
    }

    // Create transaction record for audit trail
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

    return {
      success: true,
      remainingCredits: balanceAfter,
      creditsUsed: requiredCredits
    }
  } catch (err: any) {
    console.error('Credit deduction error:', err)
    return { success: false, error: err?.message || 'Failed to deduct credits' }
  }
}

/**
 * Add credits to wallet (after purchase, bonus, refund)
 * Updates the single wallet row + creates a transaction record
 */
export async function addCredits(
  userId: string,
  amount: number,
  transactionType: 'purchase' | 'bonus' | 'refund' = 'purchase',
  description?: string
): Promise<CreditUsageResult> {
  if (!supabaseClient) {
    return { success: false, error: 'Supabase not configured' }
  }

  try {
    // Get current wallet
    const wallet = await getWallet(userId)
    const balanceBefore = wallet.total
    const balanceAfter = balanceBefore + amount

    // Upsert the wallet (single row per user)
    const { error: upsertError } = await supabaseClient
      .from('credits')
      .upsert({
        user_id: userId,
        amount: wallet.total + amount,
        used: wallet.used,
        remaining: wallet.credits + amount,
      }, {
        onConflict: 'user_id'
      })

    if (upsertError) {
      return { success: false, error: `Failed to add credits: ${upsertError.message}` }
    }

    // Create transaction record for audit trail
    await supabaseClient
      .from('transactions')
      .insert({
        user_id: userId,
        transaction_type: transactionType,
        credits: amount,
        balance_before: balanceBefore,
        balance_after: balanceAfter,
        description: description || `${amount} credits added`,
        reference_type: transactionType
      })

    return {
      success: true,
      remainingCredits: wallet.credits + amount,
      creditsUsed: amount
    }
  } catch (err: any) {
    console.error('Add credits error:', err)
    return { success: false, error: err?.message || 'Failed to add credits' }
  }
}

/**
 * Initialize wallet for a new user (starter credits)
 */
export async function initializeWallet(userId: string, startingCredits: number = 0): Promise<CreditUsageResult> {
  if (!supabaseClient) {
    return { success: false, error: 'Supabase not configured' }
  }

  try {
    // Create wallet row (will fail silently if already exists due to UNIQUE constraint)
    const { error: insertError } = await supabaseClient
      .from('credits')
      .upsert({
        user_id: userId,
        amount: startingCredits,
        used: 0,
        remaining: startingCredits,
      }, {
        onConflict: 'user_id'
      })

    if (insertError) {
      return { success: false, error: `Failed to create wallet: ${insertError.message}` }
    }

    // Log the initial credit grant as a transaction
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

    return {
      success: true,
      remainingCredits: startingCredits,
      creditsUsed: startingCredits
    }
  } catch (err: any) {
    console.error('Initialize wallet error:', err)
    return { success: false, error: err?.message || 'Failed to initialize wallet' }
  }
}

/**
 * Get transaction history for a user
 */
export async function getTransactions(userId: string, limit: number = 50): Promise<any[]> {
  if (!supabaseClient) return []

  try {
    const { data, error } = await supabaseClient
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Get transactions error:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Get transactions error:', err)
    return []
  }
}

/**
 * Credit cost for a specific feature
 */
export function getCreditCost(feature: FeatureType): number {
  return CREDIT_COSTS[feature] || 20
}

/**
 * Credit pack definitions (for future purchase)
 */
export const CREDIT_PACKS = [
  { id: 'single', credits: 20, price: 22, label: 'Quick Access', priceLabel: '₹22' },
  { id: 'starter', credits: 100, price: 99, label: 'Starter Pack', priceLabel: '₹99', popular: false },
  { id: 'growth', credits: 250, price: 199, label: 'Most Popular', priceLabel: '₹199', popular: true },
  { id: 'pro', credits: 500, price: 399, label: 'Pro Pack', priceLabel: '₹399', popular: false },
  { id: 'founder', credits: 1000, price: 699, label: 'Founder Pack', priceLabel: '₹699', popular: false },
] as const

/**
 * Single report purchase info (for future payment integration)
 */
export const SINGLE_REPORT_PURCHASE = {
  credits: 20,
  price: 22,
  priceLabel: '₹22',
  label: 'Buy Single Report'
}