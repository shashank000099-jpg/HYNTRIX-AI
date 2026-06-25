// ============================================
// REPORTS API - Fetch single report by ID
// ============================================
// Used by the report detail page to load report content

import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: reportId } = await context.params
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { success: false, error: 'Supabase not configured' },
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

    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // First check stored_reports table
    const { data: storedReport, error: storedError } = await supabase
      .from('stored_reports')
      .select('*')
      .eq('id', reportId)
      .eq('user_id', session.user.id)
      .maybeSingle()

    if (storedReport) {
      return NextResponse.json({
        success: true,
        source: 'stored_reports',
        report: storedReport.report,
        metadata: {
          id: storedReport.id,
          feature_key: storedReport.feature_key,
          feature_title: storedReport.feature_title,
          category: storedReport.category,
          input: storedReport.input,
          credits_used: storedReport.credits_used,
          created_at: storedReport.created_at,
        },
      })
    }

    // Fallback: check saved_reports table (report_id = client-generated UUID)
    const { data: savedReport } = await supabase
      .from('saved_reports')
      .select('report_id, report_type')
      .eq('report_id', reportId)
      .eq('user_id', session.user.id)
      .maybeSingle()

    if (savedReport?.report_id) {
      // Try 1: stored_reports.id == savedReport.report_id (new reports after fix)
      const { data: linkedReport } = await supabase
        .from('stored_reports')
        .select('*')
        .eq('id', savedReport.report_id)
        .maybeSingle()

      if (linkedReport) {
        console.log('[ReportAPI] Found via stored_reports.id match')
        return NextResponse.json({
          success: true,
          source: 'stored_reports_via_saved',
          report: linkedReport.report,
          metadata: {
            id: linkedReport.id,
            feature_key: linkedReport.feature_key,
            feature_title: linkedReport.feature_title,
            category: linkedReport.category,
            input: linkedReport.input,
            credits_used: linkedReport.credits_used,
            created_at: linkedReport.created_at,
          },
        })
      }

      // Try 2: report.jsonb->>id == savedReport.report_id (old reports before fix)
      const { data: linkedReportByJson } = await supabase
        .from('stored_reports')
        .select('*')
        .eq('user_id', session.user.id)
        .filter('report->>id', 'eq', savedReport.report_id)
        .maybeSingle()

      if (linkedReportByJson) {
        console.log('[ReportAPI] Found via report->>id JSONB match (backward compat)')
        return NextResponse.json({
          success: true,
          source: 'stored_reports_via_json',
          report: linkedReportByJson.report,
          metadata: {
            id: linkedReportByJson.id,
            feature_key: linkedReportByJson.feature_key,
            feature_title: linkedReportByJson.feature_title,
            category: linkedReportByJson.category,
            input: linkedReportByJson.input,
            credits_used: linkedReportByJson.credits_used,
            created_at: linkedReportByJson.created_at,
          },
        })
      }
    }

    // Not found
    console.log('[ReportAPI] Report not found:', { reportId, userId: session.user.id })
    return NextResponse.json(
      { success: false, error: 'Report not found' },
      { status: 404 }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch report'
    console.error('[ReportAPI] Error:', message)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}