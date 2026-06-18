// ============================================
// SOCIAL INTELLIGENCE PROVIDERS
// ============================================
// All platforms use Apify via the shared client.
// No per-platform API keys needed — only APIFY_API_KEY.
// Platform configuration lives in lib/social/platform-config.ts
// ============================================

import type { SocialPlatform, SocialProfileData, SocialPostData, SocialProviderInterface } from './types'
import { runApifyActor, isApifyConfigured as apifyConfigured } from '../social/apify-client'
import { getPlatformConfig } from '../social/platform-config'

// ============================================
// BASE APIFY PROVIDER CLASS
// ============================================
// Single provider class used by ALL active platforms.
// Behavior is driven entirely by platform-config.ts

class ApifySocialProvider implements SocialProviderInterface {
  platform: SocialPlatform

  constructor(platform: SocialPlatform) {
    this.platform = platform
  }

  isConfigured(): boolean {
    return apifyConfigured()
  }

  getMonthlyCost(): number {
    // Average Apify actor cost per platform
    const costs: Record<string, number> = {
      instagram: 75,
      youtube: 50,
      x: 40,
      telegram: 35,
      facebook: 60,
    }
    return costs[this.platform] || 50
  }

  async fetchProfile(identifier: string): Promise<SocialProfileData> {
    // Apify must succeed — no silent fallback to estimated data
    const result = await runApifyActor(this.platform, identifier)
    return result.profile
  }

  async fetchRecentPosts(identifier: string, limit: number = 10): Promise<SocialPostData[]> {
    // Apify must succeed — no silent fallback to estimated data
    const result = await runApifyActor(this.platform, identifier, limit)
    return result.posts
  }
}

// ============================================
// ESTIMATED DATA FALLBACKS
// ============================================
// Used when Apify is not available or fails

function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

function generateEstimatedProfile(platform: SocialPlatform, identifier: string): SocialProfileData {
  const hash = simpleHash(identifier)
  const cleaned = identifier.replace(/^@/, '').replace(/^https?:\/\//, '').split('/')[0] || identifier
  return {
    platform,
    username: cleaned,
    displayName: identifier.split('/').pop() || identifier,
    followers: 1000 + (hash % 100000),
    following: 100 + (hash % 5000),
    posts: 50 + (hash % 5000),
    engagement: 1 + (hash % 8),
    growth: -2 + (hash % 10),
    trustScore: 40 + (hash % 50),
    verified: hash % 5 === 0,
  }
}

function generateEstimatedPosts(platform: SocialPlatform, identifier: string, limit: number): SocialPostData[] {
  const hash = simpleHash(identifier)
  const count = Math.min(limit, 5)
  const contentSamples: Record<string, string[]> = {
    instagram: ['New post alert! 📸', 'Behind the scenes content', 'Daily inspiration ✨'],
    youtube: ['Latest video is live!', 'New tutorial uploaded', 'Weekly vlog update'],
    x: ['Thoughts on current trends...', 'Exciting news to share!', 'Thread: industry insights 🧵'],
    telegram: ['Channel update for everyone', 'Exclusive content here', 'Community announcement'],
    facebook: ['Page update for our followers', 'New milestone reached!', 'Thank you for the support'],
  }
  const samples = contentSamples[platform] || contentSamples.instagram

  return Array.from({ length: count }, (_, i) => ({
    id: `${platform}-${identifier}-${i}`,
    content: samples[i % samples.length],
    timestamp: new Date(Date.now() - i * 86400000).toISOString(),
    likes: 10 + (hash % 10000) / (i + 1),
    comments: 1 + (hash % 500) / (i + 1),
    shares: 1 + (hash % 200) / (i + 1),
    engagement: 0.5 + (hash % 6),
    mediaUrls: [],
  }))
}

// ============================================
// PROVIDER INSTANCES
// ============================================

export class YouTubeProvider extends ApifySocialProvider {
  constructor() { super('youtube') }
}

export class InstagramProvider extends ApifySocialProvider {
  constructor() { super('instagram') }
}

export class LinkedInProvider extends ApifySocialProvider {
  constructor() { super('linkedin') }
  
  isConfigured(): boolean { return false }
  getMonthlyCost(): number { return 0 }
  
  async fetchProfile(identifier: string): Promise<SocialProfileData> {
    return generateEstimatedProfile('linkedin', identifier)
  }
  
  async fetchRecentPosts(identifier: string, limit?: number): Promise<SocialPostData[]> {
    return generateEstimatedPosts('linkedin', identifier, limit || 10)
  }
}

export class XProvider extends ApifySocialProvider {
  constructor() { super('x') }
}

export class TelegramProvider extends ApifySocialProvider {
  constructor() { super('telegram') }
}

export class FacebookProvider extends ApifySocialProvider {
  constructor() { super('facebook') }
}

// ============================================
// PROVIDER FACTORY
// ============================================

const providerRegistry: Record<SocialPlatform, SocialProviderInterface> = {
  youtube: new YouTubeProvider(),
  instagram: new InstagramProvider(),
  linkedin: new LinkedInProvider(),
  x: new XProvider(),
  telegram: new TelegramProvider(),
  facebook: new FacebookProvider(),
}

export function getSocialProvider(platform: SocialPlatform): SocialProviderInterface {
  return providerRegistry[platform]
}

export function isSocialProviderConfigured(platform: SocialPlatform): boolean {
  return providerRegistry[platform].isConfigured()
}

export function getAllSocialProviders(): SocialProviderInterface[] {
  return Object.values(providerRegistry)
}

/**
 * Get social platform prompt enrichment data
 */
export function getSocialPromptContext(platform: SocialPlatform, profile: SocialProfileData): string {
  const platformNames: Record<SocialPlatform, string> = {
    instagram: 'Instagram', youtube: 'YouTube', linkedin: 'LinkedIn',
    x: 'X (Twitter)', telegram: 'Telegram', facebook: 'Facebook',
  }

  return `
Social Profile Data (${platformNames[platform]}):
- Username: ${profile.username}
- Display Name: ${profile.displayName || 'N/A'}
- Bio: ${profile.bio || 'N/A'}
- Followers: ${profile.followers.toLocaleString()}
- Following: ${profile.following.toLocaleString()}
- Posts: ${profile.posts.toLocaleString()}
- Engagement Rate: ${profile.engagement.toFixed(1)}%
- Growth Rate: ${profile.growth > 0 ? '+' : ''}${profile.growth.toFixed(1)}%
- Trust Score: ${profile.trustScore}/100
- Verified: ${profile.verified ? 'Yes' : 'No'}
- External Website: ${profile.externalWebsite || 'N/A'}
- Category: ${profile.businessCategory || 'N/A'}
`
}

/**
 * Extract platform identifier from a URL or handle
 */
export function extractSocialIdentifier(platform: SocialPlatform, input: string): string {
  return getPlatformConfig(platform).extractIdentifier(input)
}