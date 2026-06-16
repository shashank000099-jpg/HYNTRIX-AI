// ============================================
// SOCIAL MEDIA SERVICE — ARCHITECTURE
// ============================================
// Social API integrations (Phase 3) will be implemented here.
// All AI analysis for social features goes through lib/ai/provider.ts

export type SocialPlatform = 'youtube' | 'instagram' | 'linkedin' | 'telegram' | 'x' | 'facebook'

export interface SocialAPIConfig {
  platform: SocialPlatform
  apiKey?: string
  apiSecret?: string
  accessToken?: string
  baseUrl: string
}

export interface SocialProfileData {
  username: string
  followers: number
  following: number
  posts: number
  engagement: number
  bio: string
  avatar: string
  verified: boolean
  createdAt: string
}

export interface SocialPostData {
  id: string
  content: string
  timestamp: string
  likes: number
  comments: number
  shares: number
  engagement: number
  mediaUrls: string[]
}

export interface SocialAnalysisResult {
  platform: SocialPlatform
  username: string
  growthScore: number
  brandScore: number
  trustScore: number
  contentIdeas: string[]
  suggestions: string[]
  reportData: Record<string, any>
}