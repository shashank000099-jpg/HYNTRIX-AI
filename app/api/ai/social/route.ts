// ============================================
// SOCIAL INTELLIGENCE API
// ============================================
// Pipeline: Platform Social Data → AI Analysis → Store Report → Deduct Credits
// Uses social providers for profile data, then AI for analysis
// Credits NEVER deducted before successful generation

import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getFeatureByKey, getFeatureCredits } from '../../../../lib/features/registry'
import { getPromptTemplate } from '../../../../lib/ai/prompt-engine'
import { generateResponse, parseAIJSONResponse, getActiveProviderName } from '../../../../lib/ai/provider'
import { buildReport } from '../../../../lib/ai/report-builder'
import { getSocialProvider, extractSocialIdentifier, getSocialPromptContext } from '../../../../lib/ai/social-providers'
import type { AIGenerateRequest, AIGenerateResponse, AIReport, SocialPlatform } from '../../../../lib/ai/types'

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
  const body: AIGenerateRequest = await request.json()
  const { featureKey, input, metadata } = body

  if (!featureKey || !input) {
    return NextResponse.json(
      { success: false, error: 'Missing required fields: featureKey, input' },
      { status: 400 }
    )
  }

  // Validate feature exists and is a social feature
  const feature = getFeatureByKey(featureKey)
  if (!feature) {
    return NextResponse.json(
      { success: false, error: `Unknown feature: ${featureKey}` },
      { status: 400 }
    )
  }

  if (feature.category !== 'social-intelligence') {
    return NextResponse.json(
      { success: false, error: `Not a social feature: ${featureKey}` },
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
  // STEP 5: Fetch social profile data via Apify
  // ==========================================
  const platform = feature.platform as SocialPlatform | undefined
  let socialData = metadata?.socialData
  let socialIdentifier = input

  if (platform && !socialData) {
    try {
      const provider = getSocialProvider(platform)
      socialIdentifier = extractSocialIdentifier(platform, input)
      
      // Log which Apify actor we're using
      const { getPlatformConfig } = await import('../../../../lib/social/platform-config')
      const platformConfig = getPlatformConfig(platform)
      console.log(`[Social API] Fetching ${platform} data for "${socialIdentifier}" using Apify actor: ${platformConfig.actorId}`)
      
      const profile = await provider.fetchProfile(socialIdentifier)
      const posts = await provider.fetchRecentPosts(socialIdentifier, 10)
      
      socialData = {
        profile,
        posts,
        platform,
        platformUsername: profile.username,
        followerCount: profile.followers,
        engagementRate: profile.engagement,
        growthRate: profile.growth,
        postFrequency: profile.posts,
        trustScore: profile.trustScore,
      }
      
      console.log(`[Social API] Successfully fetched ${platform} data: ${profile.username} (${profile.followers} followers, ${posts.length} posts)`)
    } catch (err: any) {
      console.error(`[Social API] Failed to fetch ${platform} data:`, err?.message || err)
      // IMPORTANT: Do NOT continue to Gemini with empty data
      // Stop generation and return a clear error
      return NextResponse.json(
        {
          success: false,
          error: err?.message || `Unable to analyze this ${platform} profile. Please verify the URL or handle and try again.`,
          platform,
          socialIdentifier,
        },
        { status: 400 }
      )
    }
  }

  // Also verify we have actual data after successful fetch
  if (socialData?.profile) {
    const hasData = socialData.profile.followers > 0 || 
                    socialData.profile.posts > 0 || 
                    (socialData.posts && socialData.posts.length > 0)
    
    if (!hasData) {
      console.error(`[Social API] Platform returned but data is empty for ${platform}`)
      return NextResponse.json(
        {
          success: false,
          error: `Could not extract profile data from this ${platform} profile. The account may be private or restricted.`,
          platform,
          socialIdentifier,
        },
        { status: 400 }
      )
    }
  }

  // ==========================================
  // STEP 6: Build AI prompt with social context
  // ==========================================
  const userPrompt = promptTemplate.userPromptTemplate.replace('{input}', input)
  
  // Enrich prompt with social profile data if available
  let enrichedPrompt = userPrompt
  if (socialData?.profile) {
    const profileContext = getSocialPromptContext(
      platform || 'instagram',
      socialData.profile
    )
    enrichedPrompt = `${userPrompt}\n\n${profileContext}`
    
    if (socialData.posts && socialData.posts.length > 0) {
      enrichedPrompt += `\nRecent Posts (${socialData.posts.length}):\n`
      enrichedPrompt += socialData.posts.slice(0, 10).map((post: any, i: number) => {
        const viewsStr = post.views ? `, ${post.views} views` : ''
        const typeStr = post.type ? `[${post.type}] ` : ''
        const hashStr = post.hashtags?.length ? ` | Hashtags: ${post.hashtags.join(', ')}` : ''
        const mentStr = post.mentions?.length ? ` | Mentions: ${post.mentions.join(', ')}` : ''
        return `Post ${i + 1}: ${typeStr}"${post.content}" (${post.likes} likes, ${post.comments} comments${viewsStr})${hashStr}${mentStr}`
      }).join('\n')
    }
  }

  // ==========================================
  // STEP 7: Generate AI response (BEFORE deduction)
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
        error: `AI analysis failed: ${err?.message || 'Unknown error'}. Your credits were NOT deducted.`,
      },
      { status: 502 }
    )
  }

  // ==========================================
  // STEP 8: Parse AI response
  // ==========================================
  let parsedResponse: Record<string, any>
  try {
    parsedResponse = parseAIJSONResponse(aiResponseText)
  } catch (err) {
    console.error('Failed to parse AI response:', aiResponseText)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to parse AI response. Please try again. Your credits were NOT deducted.',
      },
      { status: 500 }
    )
  }

  // Add social metadata to response
  if (socialData) {
    parsedResponse.socialData = {
      platform,
      username: socialIdentifier,
      followers: socialData.followerCount,
      engagement: socialData.engagementRate,
      posts: socialData.postCount,
    }
  }

  // ==========================================
  // STEP 9: Build report
  // ==========================================
  const report = buildReport({
    featureKey,
    userId,
    input,
    aiResponse: parsedResponse,
    creditsUsed: creditsRequired,
  })

  // ==========================================
  // STEP 10: Store report (BEFORE deduction)
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
    console.error('Failed to store social report:', storeError)
  }

  // ==========================================
  // STEP 11: Deduct credits (AFTER success)
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
    console.error('CRITICAL: Credit deduction failed after successful social analysis:', deductError)
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
        details: { creditsUsed: creditsRequired, platform, socialIdentifier, provider: getActiveProviderName() },
      } as any)
  } catch (err) {
    console.error('History log error:', err)
  }

  // ==========================================
  // STEP 12: Return success response
  // ==========================================
  return NextResponse.json({
    success: true,
    report,
    remainingCredits: walletAfter,
    creditsUsed: creditsRequired,
    socialData: socialData ? {
      platform,
      username: socialIdentifier,
      followers: socialData.followerCount,
      engagement: socialData.engagementRate,
    } : null,
    usage: { inputTokens, outputTokens },
    provider: getActiveProviderName(),
  })
}