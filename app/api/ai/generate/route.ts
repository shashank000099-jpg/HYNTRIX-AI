// ============================================
// UNIVERSAL AI GENERATION API
// ============================================
// Single endpoint for ALL Hyntrix AI features
// Provider-agnostic: routes through lib/ai/provider.ts
// Architecture: Validate → Generate → Store → Deduct → Return

import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getFeatureByKey, getFeatureCredits } from '../../../../lib/features/registry'
import { getPromptTemplate } from '../../../../lib/ai/prompt-engine'
import { generateResponse, parseAIJSONResponse, isGeminiConfigured, isProviderConfigured, getActiveProviderName } from '../../../../lib/ai/provider'
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

  const hasAI = isGeminiConfigured() || isProviderConfigured('claude') || isProviderConfigured('openai')
  if (!hasAI) {
    return NextResponse.json(
      {
        success: false,
        error: 'AI provider not configured. Set GEMINI_API_KEY in your .env.local file.',
      },
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

  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: 'Not authenticated' },
      { status: 401 }
    )
  }

  const userId = session.user.id

  // ==========================================
  // STEP 2: Parse and validate request
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

  const feature = getFeatureByKey(featureKey)
  if (!feature) {
    return NextResponse.json(
      { success: false, error: `Unknown feature: ${featureKey}` },
      { status: 400 }
    )
  }

  const promptTemplate = getPromptTemplate(featureKey)
  if (!promptTemplate) {
    return NextResponse.json(
      { success: false, error: `No prompt template for feature: ${featureKey}` },
      { status: 500 }
    )
  }

  const creditsRequired = getFeatureCredits(featureKey)

  // ==========================================
  // STEP 3: Check credit balance (validate only)
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
  // STEP 4: Build prompt & fetch social data if needed
  // ==========================================
  const userPrompt = promptTemplate.userPromptTemplate.replace('{input}', input)
  let enrichedPrompt = userPrompt

  if (feature.requiresExternalData && feature.platform) {
    const socialPlatform = feature.platform as string
    if (!metadata?.socialData) {
      const { getPlatformConfig, isApifyConfigured } = await import('../../../../lib/social/platform-config')
      const platformConfig = getPlatformConfig(socialPlatform as any)

      if (platformConfig.actorId) {
        if (isApifyConfigured()) {
          try {
            const { runApifyActor } = await import('../../../../lib/social/apify-client')
            console.log(`[API] Fetching ${socialPlatform} data for "${input}" via ${platformConfig.actorId}`)

            const apifyResult = await runApifyActor(socialPlatform as any, input, 10)

            console.log(`[API] ${socialPlatform} OK: ${apifyResult.profile.username} (${apifyResult.profile.followers} followers, ${apifyResult.posts.length} posts)`)

            enrichedPrompt += `\n\nSOCIAL PROFILE DATA:\n`
            enrichedPrompt += `Username: ${apifyResult.profile.username}\n`
            enrichedPrompt += `Display Name: ${apifyResult.profile.displayName || 'N/A'}\n`
            enrichedPrompt += `Bio: ${apifyResult.profile.bio || 'N/A'}\n`
            enrichedPrompt += `Followers: ${apifyResult.profile.followers.toLocaleString()}\n`
            enrichedPrompt += `Following: ${apifyResult.profile.following.toLocaleString()}\n`
            enrichedPrompt += `Posts: ${apifyResult.profile.posts}\n`
            enrichedPrompt += `Verified: ${apifyResult.profile.verified ? 'Yes' : 'No'}\n`
            enrichedPrompt += `Engagement Rate: ${apifyResult.profile.engagement.toFixed(1)}%\n`
            enrichedPrompt += `Trust Score: ${apifyResult.profile.trustScore}/100\n`

            if (apifyResult.posts.length > 0) {
              enrichedPrompt += `\nRecent Posts:\n`
              apifyResult.posts.slice(0, 10).forEach((post: any, i: number) => {
                enrichedPrompt += `${i + 1}. "${post.content}" (${post.likes} likes, ${post.comments} comments)\n`
              })
            }
          } catch (err: any) {
            console.error(`[API] ${socialPlatform} fetch failed: ${err?.message}`)
            return NextResponse.json({
              success: false,
              error: err?.message || `Unable to fetch ${feature.title} data. Please verify the username and try again.`,
              platform: socialPlatform,
            }, { status: 400 })
          }
        } else {
          return NextResponse.json({
            success: false,
            error: `Apify API key not configured. Set APIFY_API_KEY to use ${feature.title}.`,
          }, { status: 500 })
        }
      } else {
        console.log(`[API] ${socialPlatform} has no Apify actor — using text-only analysis`)
        enrichedPrompt = `${userPrompt}\n\nNote: No external data source is connected for ${socialPlatform}. Analyze based on the username/handle provided.`
      }
    } else {
      enrichedPrompt = `${userPrompt}\n\nSocial Profile Data:\n${JSON.stringify(metadata.socialData, null, 2)}`
    }
  }

  // ==========================================
  // STEP 5: Generate AI response (BEFORE deduction)
  // ==========================================
  let aiResponseText: string
  let inputTokens = 0
  let outputTokens = 0

  try {
    const aiResult = await generateResponse({
      system: promptTemplate.systemPrompt,
      messages: [{ role: 'user', content: enrichedPrompt }],
      temperature: promptTemplate.temperature ?? 0.7,
      maxTokens: promptTemplate.maxTokens ?? 4096,
      responseSchema: promptTemplate.outputSchema,
    })

    aiResponseText = aiResult.text
    inputTokens = aiResult.usage.inputTokens
    outputTokens = aiResult.usage.outputTokens
  } catch (err: any) {
    console.error('AI generation error:', err)
    return NextResponse.json(
      {
        success: false,
        error: `AI generation failed: ${err?.message || 'Unknown error'}. Your credits were NOT deducted.`,
      },
      { status: 502 }
    )
  }

  // ==========================================
  // STEP 6: Parse AI response
  // ==========================================
  let parsedResponse: Record<string, any>
  try {
    parsedResponse = parseAIJSONResponse(aiResponseText)
  } catch (err) {
    console.error('Failed to parse AI response:', aiResponseText.slice(0, 200))
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to parse AI response. Please try again. Your credits were NOT deducted.',
      },
      { status: 500 }
    )
  }

  // ==========================================
  // STEP 7: Build report
  // ==========================================
  const report = buildReport({
    featureKey,
    userId,
    input,
    aiResponse: parsedResponse,
    creditsUsed: creditsRequired,
  })

  // ==========================================
  // STEP 8: Save report (BEFORE deduction)
  // ==========================================
  const { error: storeError } = await supabase
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

  if (storeError) {
    console.error('Failed to store report:', storeError)
  }

  // ==========================================
  // STEP 8b: Also save to saved_reports for discoverability
  // This is what the saved-reports page queries
  // ==========================================
  try {
    const categoryMap: Record<string, string> = {
      'startup-intelligence': 'startup',
      'founder-intelligence': 'founder',
      'social-intelligence': 'social',
      'opportunity-hub': 'startup',
      'board-room': 'founder',
      'ai-client-finder': 'startup',
    }
    const reportType = categoryMap[feature.category] || 'startup'
    
    await supabase.from('saved_reports').insert({
      user_id: userId,
      report_type: reportType,
      report_id: report.id,
      title: feature.title,
      subtitle: input.length > 100 ? input.slice(0, 100) + '...' : input,
      score: report.overallScore,
    })
  } catch (err) {
    console.error('Failed to save to saved_reports:', err)
  }

  // ==========================================
  // STEP 9: DEDUCT CREDITS (AFTER success)
  // ==========================================
  const walletData = wallet as { remaining: number; used: number } | null
  const walletBefore = walletData?.remaining ?? 0
  const walletAfter = walletBefore - creditsRequired

  const { error: deductError } = await supabase
    .from('credits')
    .update({ remaining: walletAfter, used: (walletData?.used || 0) + creditsRequired } as any)
    .eq('user_id', userId)

  if (deductError) {
    console.error('CRITICAL: Credit deduction failed after successful generation:', deductError)
  }

  try {
    await supabase.from('transactions').insert({
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

  try {
    await supabase.from('history').insert({
      user_id: userId,
      action: `Generated ${feature.title} report`,
      feature: featureKey,
      feature_type: feature.category,
      report_id: report.id,
      score: report.overallScore,
      details: { creditsUsed: creditsRequired, inputTokens, outputTokens, provider: getActiveProviderName() },
    } as any)
  } catch (err) {
    console.error('History log error:', err)
  }

  // ==========================================
  // STEP 10: Return success
  // ==========================================
  return NextResponse.json({
    success: true,
    report,
    remainingCredits: walletAfter,
    creditsUsed: creditsRequired,
    usage: { inputTokens, outputTokens },
    provider: getActiveProviderName(),
  })
}