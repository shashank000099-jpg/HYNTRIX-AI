// ============================================
// UNIVERSAL AI GENERATION API
// ============================================
// Single endpoint for ALL Hyntrix AI features
// Architecture: Validate → Generate → Store → Deduct → Return

import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getFeatureByKey, getFeatureCredits } from '../../../../lib/features/registry'
import { getPromptTemplate } from '../../../../lib/ai/prompt-engine'
import { generateClaudeResponse, parseClaudeJSONResponse, isClaudeConfigured } from '../../../../lib/ai/claude'
import { buildReport } from '../../../../lib/ai/report-builder'
import type { AIGenerateRequest, AIGenerateResponse, AIReport } from '../../../../lib/ai/types'

// ============================================
// CREDIT SAFETY: Validate → Generate → Save → Deduct
// Credits are NEVER deducted before successful generation
// ============================================

export async function POST(request: Request) {
  // ==========================================
  // STEP 1: Validate environment
  // ==========================================
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { success: false, error: 'Supabase not configured' },
      { status: 500 }
    )
  }

  if (!isClaudeConfigured()) {
    return NextResponse.json(
      { success: false, error: 'Claude API not configured. Set ANTHROPIC_API_KEY in environment.' },
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
  // STEP 3: Parse and validate request
  // ==========================================
  const body: AIGenerateRequest = await request.json()
  const { featureKey, input, metadata } = body

  if (!featureKey || !input) {
    return NextResponse.json(
      { success: false, error: 'Missing required fields: featureKey, input' },
      { status: 400 }
    )
  }

  if (input.length < 3) {
    return NextResponse.json(
      { success: false, error: 'Input must be at least 3 characters' },
      { status: 400 }
    )
  }

  // Validate feature exists
  const feature = getFeatureByKey(featureKey)
  if (!feature) {
    return NextResponse.json(
      { success: false, error: `Unknown feature: ${featureKey}` },
      { status: 400 }
    )
  }

  // Validate prompt template exists
  const promptTemplate = getPromptTemplate(featureKey)
  if (!promptTemplate) {
    return NextResponse.json(
      { success: false, error: `No prompt template for feature: ${featureKey}` },
      { status: 500 }
    )
  }

  const creditsRequired = getFeatureCredits(featureKey)

  // ==========================================
  // STEP 4: Check credit balance (validate only, don't deduct yet)
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
  // STEP 5: Build Claude prompt
  // ==========================================
  const userPrompt = promptTemplate.userPromptTemplate.replace('{input}', input)

  // If social feature with metadata, enrich prompt
  const enrichedPrompt = metadata?.socialData
    ? `${userPrompt}\n\nSocial Profile Data:\n${JSON.stringify(metadata.socialData, null, 2)}`
    : userPrompt

  // ==========================================
  // STEP 6: Generate AI response (BEFORE deduction)
  // ==========================================
  let claudeResponseText: string
  let inputTokens = 0
  let outputTokens = 0

  try {
    const claudeResult = await generateClaudeResponse({
      system: promptTemplate.systemPrompt,
      messages: [{ role: 'user', content: enrichedPrompt }],
      temperature: promptTemplate.temperature ?? 0.7,
      maxTokens: promptTemplate.maxTokens ?? 4096,
    })

    claudeResponseText = claudeResult.text
    inputTokens = claudeResult.usage.inputTokens
    outputTokens = claudeResult.usage.outputTokens
  } catch (err: any) {
    console.error('Claude API error:', err)
    return NextResponse.json(
      {
        success: false,
        error: `AI generation failed: ${err?.message || 'Unknown error'}. Your credits were NOT deducted.`,
      },
      { status: 502 }
    )
  }

  // ==========================================
  // STEP 7: Parse Claude response
  // ==========================================
  let parsedResponse: Record<string, any>
  try {
    parsedResponse = parseClaudeJSONResponse(claudeResponseText)
  } catch (err) {
    console.error('Failed to parse Claude response:', claudeResponseText)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to parse AI response. Please try again. Your credits were NOT deducted.',
      },
      { status: 500 }
    )
  }

  // ==========================================
  // STEP 8: Build report
  // ==========================================
  const report = buildReport({
    featureKey,
    userId,
    input,
    claudeResponse: parsedResponse,
    creditsUsed: creditsRequired,
  })

  // ==========================================
  // STEP 9: Save report to database (BEFORE deduction)
  // ==========================================
  const { data: storedReport, error: storeError } = await supabase
    .from('stored_reports')
    .insert({
      user_id: userId,
      feature_key: featureKey,
      feature_title: feature.title,
      category: feature.category,
      input: input,
      report: report,
      credits_used: creditsRequired,
      created_at: report.createdAt,
    })
    .select()
    .single()

  if (storeError) {
    console.error('Failed to store report:', storeError)
    // Non-fatal: report still generated, return it
  }

  // ==========================================
  // STEP 10: DEDUCT CREDITS (AFTER successful generation + storage)
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
    console.error('CRITICAL: Credit deduction failed after successful generation:', deductError)
    // Report still generated, but log for admin investigation
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
        description: `Used ${creditsRequired} credits for ${featureKey}`,
        reference_type: 'feature',
        reference_id: featureKey,
      } as any)
  } catch (err) {
    console.error('Transaction record error:', err)
  }

  // Log to history
  try {
    await supabase
      .from('history')
      .insert({
        user_id: userId,
        action: `Generated ${feature.title} report`,
        feature: featureKey,
        feature_type: feature.category,
        report_id: report.id,
        score: report.overallScore,
        details: { creditsUsed: creditsRequired, inputTokens, outputTokens },
      } as any)
  } catch (err) {
    console.error('History log error:', err)
  }

  // ==========================================
  // STEP 11: Return success response
  // ==========================================
  return NextResponse.json({
    success: true,
    report,
    remainingCredits: walletAfter,
    creditsUsed: creditsRequired,
    usage: { inputTokens, outputTokens },
  })
}