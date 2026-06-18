// ============================================
// SHARED APIFY CLIENT
// ============================================
// Single unified Apify client used by ALL social platforms
// No platform-specific logic — driven entirely by platform-config.ts
// ============================================

import type { SocialPlatform, SocialProfileData, SocialPostData } from '../ai/types'
import { getPlatformConfig, getApifyToken, isApifyConfigured } from './platform-config'

export interface ApifyRunResult {
  profile: SocialProfileData
  posts: SocialPostData[]
  raw?: any
  actorId: string
  recordsReturned: number
}

/**
 * Run an Apify actor for a given platform and identifier
 * Uses platform configuration to map input/output
 * THROWS if Apify fails or returns no data — no silent fallbacks
 * 
 * CRITICAL: ALWAYS extracts a clean identifier from URLs before passing to inputMapper
 * This ensures Instagram handles URLs like 'https://www.instagram.com/cristiano/' 
 * are passed as 'cristiano' to the input mapper.
 */
export async function runApifyActor(
  platform: SocialPlatform,
  identifier: string,
  limit?: number
): Promise<ApifyRunResult> {
  const config = getPlatformConfig(platform)
  const token = getApifyToken()

  if (!token) {
    throw new Error(
      `Apify API key not configured. Set APIFY_API_KEY in your .env.local file. ` +
      `Get your key at https://console.apify.com/`
    )
  }

  if (!config.actorId) {
    throw new Error(`No Apify actor configured for platform: ${platform}`)
  }

  // STEP 1: Extract clean identifier from URL/handle BEFORE passing to inputMapper
  // This is the critical fix: inputMapper expects clean usernames, not full URLs
  const cleanIdentifier = config.extractIdentifier(identifier)
  console.log(`[Apify] Platform ${config.displayName}: raw="${identifier}" -> cleaned="${cleanIdentifier}"`)

  // Log actor execution
  console.log(`[Apify] Starting actor ${config.actorId} (${config.displayName}) for "${cleanIdentifier}"`)

  // Map input using platform config (with clean identifier)
  const actorInput = config.inputMapper(cleanIdentifier, limit)
  console.log(`[Apify] Actor input:`, JSON.stringify(actorInput))

  // Run the actor using SYNC endpoint that WAITS for completion
  // CRITICAL: Using /runs is ASYNC - returns immediately with empty dataset
  // Using /run-sync-get-dataset-items WAITS for actor to finish, returns full data
  const runStartTime = Date.now()
  const actorPath = config.actorId.replace('/', '~')
  const syncUrl = `https://api.apify.com/v2/acts/${actorPath}/run-sync-get-dataset-items?token=${token}`
 
  console.log(`[Apify] Executing SYNC actor run: ${config.actorId}`)
  
  const runResponse = await fetch(syncUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(actorInput),
  })

  if (!runResponse.ok) {
    const errorBody = await runResponse.text()
    console.error(`[Apify] Actor ${config.actorId} HTTP ${runResponse.status}: ${errorBody}`)
    throw new Error(
      `Unable to fetch ${config.displayName} data. The platform may be temporarily unavailable. ` +
      `Please try again later.`
    )
  }

  const runData = await runResponse.json()
  const data = Array.isArray(runData) ? runData : runData?.data || runData?.items || []
  
  console.log(`[Apify] SYNC actor returned ${data.length} items in ${Date.now() - runStartTime}ms`)

  // CRITICAL: If Apify returned no records, stop here
  if (!data || data.length === 0) {
    console.error(`[Apify] Actor ${config.actorId} returned 0 records for "${identifier}"`)
    throw new Error(
      `No ${config.displayName} profile found for "${identifier}". ` +
      `Please verify the username or URL is correct.`
    )
  }

  // Log results
  const runDuration = Date.now() - runStartTime
  console.log(`[Apify] Actor ${config.actorId} returned ${data.length} records in ${runDuration}ms`)

  // Map profile and posts using platform config
  const profile = config.profileMapper(data, identifier)
  const posts = config.postsMapper(data, identifier)

  // Validate we got real data, not defaults
  const hasRealData = profile.followers > 0 || profile.posts > 0 || (posts && posts.length > 0)

  if (!hasRealData) {
    console.error(`[Apify] Actor ${config.actorId} returned data but all values are zero for "${identifier}"`)
    throw new Error(
      `Could not extract profile data from this ${config.displayName} profile. ` +
      `The account may be private, restricted, or the URL may be invalid.`
    )
  }

  console.log(`[Apify] Profile: ${profile.username} (${profile.followers} followers, ${posts.length} posts)`)

  return {
    profile: {
      platform,
      username: profile.username || identifier,
      displayName: profile.displayName,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      followers: profile.followers || 0,
      following: profile.following || 0,
      posts: profile.posts || 0,
      engagement: profile.engagement || 0,
      growth: profile.growth || 0,
      trustScore: profile.trustScore || 50,
      verified: !!profile.verified,
      externalWebsite: profile.externalWebsite,
      businessCategory: profile.businessCategory,
    },
    posts: (posts || []).map((p) => ({
      id: p.id || `post-${Math.random().toString(36).slice(2)}`,
      url: p.url,
      type: p.type,
      content: p.content || '',
      timestamp: p.timestamp || new Date().toISOString(),
      likes: p.likes || 0,
      comments: p.comments || 0,
      shares: p.shares || 0,
      views: p.views || 0,
      engagement: p.engagement || 0,
      mediaUrls: p.mediaUrls || [],
      thumbnailUrl: p.thumbnailUrl,
      hashtags: p.hashtags,
      mentions: p.mentions,
    })),
    raw: data,
    actorId: config.actorId,
    recordsReturned: data.length,
  }
}

/**
 * Generic check if Apify is configured
 */
export { isApifyConfigured }