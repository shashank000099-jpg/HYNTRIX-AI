'use client'

import { supabaseClient } from './supabase/client'

export interface SavedReport {
  id: string
  user_id: string
  report_type: 'startup' | 'founder' | 'social'
  report_id: string
  title: string | null
  subtitle: string | null
  score: number | null
  saved_at: string
}

export interface HistoryEntry {
  id: string
  user_id: string
  action: string
  feature: string | null
  feature_type: string | null
  report_id: string | null
  score: number | null
  details: any
  created_at: string
}

/**
 * Save a report to user's library
 */
export async function saveReport(
  userId: string,
  reportType: 'startup' | 'founder' | 'social',
  reportId: string,
  title?: string,
  subtitle?: string,
  score?: number
): Promise<boolean> {
  if (!supabaseClient) return false
  try {
    await supabaseClient.from('saved_reports').insert({
      user_id: userId,
      report_type: reportType,
      report_id: reportId,
      title,
      subtitle,
      score,
    })
    return true
  } catch (err) {
    console.error('Error saving report:', err)
    return false
  }
}

/**
 * Delete a saved report
 */
export async function deleteSavedReport(reportId: string): Promise<boolean> {
  if (!supabaseClient) return false
  try {
    await supabaseClient.from('saved_reports').delete().eq('id', reportId)
    return true
  } catch (err) {
    console.error('Error deleting saved report:', err)
    return false
  }
}

/**
 * Get all saved reports for a user
 */
export async function getSavedReports(userId: string): Promise<SavedReport[]> {
  if (!supabaseClient) return []
  try {
    const { data } = await supabaseClient
      .from('saved_reports')
      .select('*')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false })
    return (data as SavedReport[]) || []
  } catch (err) {
    console.error('Error fetching saved reports:', err)
    return []
  }
}

/**
 * Get history for a user
 */
export async function getHistory(userId: string): Promise<HistoryEntry[]> {
  if (!supabaseClient) return []
  try {
    const { data } = await supabaseClient
      .from('history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return (data as HistoryEntry[]) || []
  } catch (err) {
    console.error('Error fetching history:', err)
    return []
  }
}

/**
 * Log an action to history
 */
export async function logHistory(
  userId: string,
  action: string,
  feature?: string,
  featureType?: string,
  reportId?: string,
  score?: number,
  details?: any
): Promise<boolean> {
  if (!supabaseClient) return false
  try {
    await supabaseClient.from('history').insert({
      user_id: userId,
      action,
      feature,
      feature_type: featureType,
      report_id: reportId,
      score,
      details,
    })
    return true
  } catch (err) {
    console.error('Error logging history:', err)
    return false
  }
}

/**
 * Search saved reports
 */
export async function searchSavedReports(
  userId: string,
  query: string
): Promise<SavedReport[]> {
  if (!supabaseClient) return []
  try {
    const { data } = await supabaseClient
      .from('saved_reports')
      .select('*')
      .eq('user_id', userId)
      .ilike('title', `%${query}%`)
      .order('saved_at', { ascending: false })
    return (data as SavedReport[]) || []
  } catch (err) {
    console.error('Error searching saved reports:', err)
    return []
  }
}

/**
 * Filter saved reports by type
 */
export async function filterSavedReports(
  userId: string,
  reportType: string
): Promise<SavedReport[]> {
  if (!supabaseClient) return []
  try {
    const { data } = await supabaseClient
      .from('saved_reports')
      .select('*')
      .eq('user_id', userId)
      .eq('report_type', reportType)
      .order('saved_at', { ascending: false })
    return (data as SavedReport[]) || []
  } catch (err) {
    console.error('Error filtering saved reports:', err)
    return []
  }
}