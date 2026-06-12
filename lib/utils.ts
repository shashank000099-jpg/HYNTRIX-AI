// Helper functions for Hyntrix AI

import { supabaseClient } from './supabase/client'
import type { User } from './types'

/**
 * Get current user from Supabase
 */
export async function getCurrentUser(): Promise<User | null> {
  if (!supabaseClient) return null

  try {
    const { data: { user: authUser } } = await supabaseClient.auth.getUser()
    
    if (!authUser) return null

    const { data: userData } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle()

    return userData as User || null
  } catch (err) {
    console.error('Error getting current user:', err)
    return null
  }
}

/**
 * Check if user has enough credits for a feature
 */
export async function checkCredits(userId: string, creditsNeeded: number): Promise<boolean> {
  if (!supabaseClient) return false

  try {
    const { data } = await supabaseClient
      .from('credits')
      .select('remaining')
      .eq('user_id', userId)
      .maybeSingle()

    return data ? data.remaining >= creditsNeeded : false
  } catch (err) {
    console.error('Error checking credits:', err)
    return false
  }
}

/**
 * Deduct credits after feature use
 */
export async function deductCredits(userId: string, amount: number, featureName: string): Promise<boolean> {
  if (!supabaseClient) return false

  try {
    const { data: creditData } = await supabaseClient
      .from('credits')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (!creditData || creditData.remaining < amount) {
      return false
    }

    // Update credits
    await supabaseClient
      .from('credits')
      .update({
        used: creditData.used + amount,
        remaining: creditData.remaining - amount
      })
      .eq('user_id', userId)

    // Log to history
    await supabaseClient
      .from('history')
      .insert({
        user_id: userId,
        action: `Used ${amount} credits for ${featureName}`,
        feature: featureName,
        details: { credits_used: amount }
      })

    return true
  } catch (err) {
    console.error('Error deducting credits:', err)
    return false
  }
}

/**
 * Add XP to user after completing a feature
 */
export async function addXP(userId: string, xpAmount: number): Promise<void> {
  if (!supabaseClient) return

  try {
    const { data: user } = await supabaseClient
      .from('users')
      .select('xp, level')
      .eq('id', userId)
      .maybeSingle()

    if (!user) return

    const newXP = user.xp + xpAmount
    const newLevel = Math.floor(newXP / 1000) + 1

    await supabaseClient
      .from('users')
      .update({
        xp: newXP,
        level: newLevel
      })
      .eq('id', userId)
  } catch (err) {
    console.error('Error adding XP:', err)
  }
}

/**
 * Save a report to user's library
 */
export async function saveReport(
  userId: string,
  reportType: 'startup' | 'founder' | 'social',
  reportId: string
): Promise<boolean> {
  if (!supabaseClient) return false

  try {
    await supabaseClient
      .from('saved_reports')
      .insert({
        user_id: userId,
        report_type: reportType,
        report_id: reportId
      })

    return true
  } catch (err) {
    console.error('Error saving report:', err)
    return false
  }
}

/**
 * Log user action to history
 */
export async function logAction(
  userId: string,
  action: string,
  feature: string,
  details?: Record<string, any>
): Promise<void> {
  if (!supabaseClient) return

  try {
    await supabaseClient
      .from('history')
      .insert({
        user_id: userId,
        action,
        feature,
        details
      })
  } catch (err) {
    console.error('Error logging action:', err)
  }
}

/**
 * Format large numbers (1000 -> 1K)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * Format date to readable string
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format date with time
 */
export function formatDateTime(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Truncate text to specific length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Get score color based on value (0-100)
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-400'
  if (score >= 60) return 'text-yellow-400'
  if (score >= 40) return 'text-orange-400'
  return 'text-red-400'
}

/**
 * Get score background color based on value
 */
export function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-green-500/20'
  if (score >= 60) return 'bg-yellow-500/20'
  if (score >= 40) return 'bg-orange-500/20'
  return 'bg-red-500/20'
}

/**
 * Calculate days until deadline
 */
export function daysUntil(date: string): number {
  const deadline = new Date(date).getTime()
  const today = new Date().getTime()
  return Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
}

/**
 * Generate API error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unknown error occurred'
}