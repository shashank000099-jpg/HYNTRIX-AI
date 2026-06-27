// ============================================
// AI CLIENT FINDER API
// ============================================
// Pipeline: Validate Credits → AI Search → Store Report → Deduct Credits → Return
// Credits NEVER deducted before successful generation

import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { clientFinderEngine, clientFinderToAIReport, CLIENT_FINDER_CONFIG } from '../../../../lib/ai/client-finder-engine'
import type { ClientFinderSearchRequest, AIReport } from '../../../../lib/ai/types'

const FEATURE_UNAVAILABLE_ERROR = 'This feature is temporarily unavailable. Please try again later.'
const CLIENT_FINDER_ERROR = 'Client search could not be completed right now. Your credits were not deducted.'

export async function POST(request: Request) {
  // ==========================================
  // STEP 1: Validate environment
  // ==========================================
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[ClientFinder] Supabase configuration missing')
    return NextResponse.json(
      { success: false, error: FEATURE_UNAVAILABLE_ERROR },
      { status: 500 }
    )
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.headers.get('cookie')?.split(';').map(c => {
          const [name, value] = c.trim().split('=')
          return { name, value }
        }) || []
      },
      setAll() {},
    },
  })

  // ==========================================
  // STEP 2: Validate authentication
  // ==========================================
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: 'Not authenticated' },
      { status: 401 }
    )
  }

  const userId = session.user.id

  // ==========================================
  // STEP 3: Parse request
  // ==========================================
  const body = await request.json()
  const {
    serviceType,
    targetIndustry,
    targetLocation,
    keywords,
    companySize,
    maxResults,
  } = body

  if (!serviceType || !keywords || !Array.isArray(keywords) || keywords.length === 0) {
    return NextResponse.json(
      { success: false, error: 'Missing required fields: serviceType, keywords' },
      { status: 400 }
    )
  }

  const creditsRequired = CLIENT_FINDER_CONFIG.creditsPerSearch

  // ==========================================
  // STEP 4: Check credits (validate only)
  // ==========================================
  const { data: wallet } = await supabase
    .from('credits')
    .select('remaining')
    .eq('user_id', userId)
    .maybeSingle()

  const currentCredits = wallet?.remaining ?? 0

  if (currentCredits < creditsRequired) {
    return NextResponse.json(
      {
        success: false,
        error: `Insufficient credits. You need ${creditsRequired} credits but only have ${currentCredits}.`,
        currentCredits,
        requiredCredits: creditsRequired,
      },
      { status: 402 }
    )
  }

  // ==========================================
  // STEP 5: Build search request
  // ==========================================
  const searchRequest: ClientFinderSearchRequest = {
    serviceType,
    targetIndustry: targetIndustry || undefined,
    targetLocation: targetLocation || undefined,
    keywords: Array.isArray(keywords) ? keywords : [keywords],
    companySize: companySize || undefined,
    maxResults: maxResults || CLIENT_FINDER_CONFIG.defaultMaxResults,
  }

  // ==========================================
  // STEP 6: Run AI client finder (BEFORE deduction)
  // ==========================================
  let leads
  try {
    leads = await clientFinderEngine.search(searchRequest)
  } catch (err: any) {
    console.error('Client Finder search error:', err)
    return NextResponse.json(
      {
        success: false,
        error: CLIENT_FINDER_ERROR,
      },
      { status: 502 }
    )
  }

  // ==========================================
  // STEP 7: Build report
  // ==========================================
  const finderReport = clientFinderEngine.buildReport(searchRequest, leads)
  const partialReport = clientFinderToAIReport(finderReport, userId)
  const report = {
    ...partialReport,
    id: finderReport.searchId,
    createdAt: finderReport.createdAt,
  } as AIReport

  // ==========================================
  // STEP 8: Store report to database
  // ==========================================
  const { error: storeError } = await supabase
    .from('stored_reports')
    .insert({
      user_id: userId,
      feature_key: 'ai-client-finder',
      feature_title: 'AI Client Finder',
      category: 'ai-client-finder',
      input: JSON.stringify(searchRequest),
      report: report,
      credits_used: creditsRequired,
      created_at: report.createdAt,
    })

  if (storeError) {
    console.error('Failed to store client finder report:', storeError)
  }

  // ==========================================
  // STEP 9: Deduct credits (AFTER success)
  // ==========================================
  const walletData = wallet as { remaining: number; used: number } | null
  const walletBefore = walletData?.remaining ?? 0
  const walletAfter = walletBefore - creditsRequired

  const { error: deductError } = await supabase
    .from('credits')
    .update({
      remaining: walletAfter,
      used: (walletData?.used || 0) + creditsRequired,
    } as any)
    .eq('user_id', userId)

  if (deductError) {
    console.error('CRITICAL: Credit deduction failed after successful client finder search:', deductError)
  }

  // Create transaction record
  try {
    await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        transaction_type: 'usage',
        credits: creditsRequired,
        balance_before: walletBefore,
        balance_after: walletAfter,
        description: `Used ${creditsRequired} credits for AI Client Finder`,
        reference_type: 'feature',
        reference_id: 'ai-client-finder',
      } as any)
  } catch (err) {
    console.error('Transaction record error:', err)
  }

  // Store lead results in client finder tables
  try {
    const { data: searchRecord } = await supabase
      .from('client_finder_searches')
      .insert({
        user_id: userId,
        search_query: serviceType,
        industry: targetIndustry || null,
        location: targetLocation || null,
        keywords: keywords,
        results_count: leads.length,
        credits_used: creditsRequired,
      })
      .select()
      .single()

    if (searchRecord) {
      for (const lead of leads.slice(0, 10)) { // Store top 10 leads
        await supabase
          .from('client_finder_results')
          .insert({
            search_id: searchRecord.id,
            company_name: lead.companyName,
            website: lead.website || null,
            industry: lead.industry,
            size: lead.size || null,
            location: lead.location || null,
            tech_stack: lead.techStack || [],
            funding: lead.funding || null,
            fit_score: lead.fitScore,
            opportunity_summary: lead.opportunitySummary,
            outreach_text: lead.outreachMessage,
            decision_makers: lead.decisionMakers || null,
          } as any)
      }
    }
  } catch (err) {
    console.error('Client finder data storage error:', err)
  }

  // Log to history
  try {
    await supabase
      .from('history')
      .insert({
        user_id: userId,
        action: 'Generated AI Client Finder leads',
        feature: 'ai-client-finder',
        feature_type: 'ai-client-finder',
        report_id: finderReport.searchId,
        score: finderReport.averageFitScore,
        details: { leadsCount: leads.length, creditsUsed: creditsRequired },
      } as any)
  } catch (err) {
    console.error('History log error:', err)
  }

  // ==========================================
  // STEP 10: Return results
  // ==========================================
  return NextResponse.json({
    success: true,
    leads,
    averageFitScore: finderReport.averageFitScore,
    totalLeads: finderReport.totalLeads,
    report,
    remainingCredits: walletAfter,
    creditsUsed: creditsRequired,
  })
}
