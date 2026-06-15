// ============================================
// UNIVERSAL AI ENGINE — CORE TYPE DEFINITIONS
// ============================================
// Supports ALL 36+ Hyntrix AI features

// ============================================
// PROVIDER TYPES
// ============================================

export type AIProvider = 'claude' | 'gemini' | 'openai'

export interface AIProviderConfig {
  provider: AIProvider
  model: string
  maxTokens: number
  temperature: number
  apiKey: string
}

export const DEFAULT_CLAUDE_CONFIG: AIProviderConfig = {
  provider: 'claude',
  model: 'claude-3-5-sonnet-20241022',
  maxTokens: 4096,
  temperature: 0.7,
  apiKey: process.env.ANTHROPIC_API_KEY || '',
}

// ============================================
// FEATURE CATEGORIES
// ============================================

export type FeatureCategory =
  | 'startup-intelligence'
  | 'founder-intelligence'
  | 'opportunity-hub'
  | 'social-intelligence'
  | 'board-room'
  | 'ai-client-finder'

// ============================================
// FEATURE REGISTRY ENTRY
// ============================================

export interface FeatureRegistryEntry {
  key: string
  title: string
  description: string
  category: FeatureCategory
  credits: number
  promptTemplateKey: string
  inputLabel: string
  fields?: string[]
  platform?: string
  requiresExternalData?: boolean
  externalDataSource?: string[]
}

// ============================================
// PROMPT TEMPLATE
// ============================================

export interface PromptTemplate {
  systemPrompt: string
  userPromptTemplate: string
  outputSchema: Record<string, any>
  temperature?: number
  maxTokens?: number
}

// ============================================
// AI GENERATION REQUEST/RESPONSE
// ============================================

export interface AIGenerateRequest {
  featureKey: string
  input: string
  userId: string
  metadata?: {
    platform?: string
    platformUsername?: string
    socialData?: Record<string, any>
    additionalContext?: Record<string, any>
  }
}

export interface AIGenerateResponse {
  success: boolean
  report?: AIReport
  error?: string
  creditsUsed?: number
}

// ============================================
// UNIVERSAL REPORT STRUCTURE
// ============================================

export interface AIReport {
  id: string
  userId: string
  featureKey: string
  featureTitle: string
  category: FeatureCategory
  input: string
  scores: Record<string, number>
  overallScore: number
  verdict: string
  summary: string
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
  recommendations: string[]
  insights: string[]
  actionPlan: string[]
  riskLevel: 'low' | 'medium' | 'high'
  confidenceScore: number
  metadata?: Record<string, any>
  creditsUsed: number
  createdAt: string
  saved: boolean
}

// ============================================
// SOCIAL PLATFORM PROVIDER INTERFACES
// ============================================

export type SocialPlatform = 'instagram' | 'youtube' | 'linkedin' | 'x' | 'telegram' | 'facebook'

export interface SocialProfileData {
  platform: SocialPlatform
  username: string
  displayName?: string
  bio?: string
  avatarUrl?: string
  followers: number
  following: number
  posts: number
  engagement: number
  growth: number
  trustScore: number
  verified: boolean
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

export interface SocialProviderInterface {
  platform: SocialPlatform
  fetchProfile(identifier: string): Promise<SocialProfileData>
  fetchRecentPosts(identifier: string, limit?: number): Promise<SocialPostData[]>
  isConfigured(): boolean
  getMonthlyCost(): number
}

// ============================================
// CLIENT FINDER TYPES
// ============================================

export interface ClientFinderSearchRequest {
  serviceType: string
  targetIndustry?: string
  targetLocation?: string
  keywords: string[]
  companySize?: string
  maxResults?: number
}

export interface LeadResult {
  companyName: string
  website?: string
  industry: string
  size?: string
  location?: string
  techStack: string[]
  funding?: string
  fitScore: number
  opportunitySummary: string
  outreachMessage: string
  decisionMakers?: { name: string; role: string; linkedin?: string }[]
}

export interface ClientFinderReport {
  searchId: string
  request: ClientFinderSearchRequest
  leads: LeadResult[]
  totalLeads: number
  averageFitScore: number
  industryBreakdown: Record<string, number>
  insights: string[]
  recommendations: string[]
  createdAt: string
}

// ============================================
// CREDIT SAFETY TYPES
// ============================================

export interface CreditSafetyResult {
  success: boolean
  error?: string
  creditsToDeduct: number
  currentBalance?: number
}

// ============================================
// REPORT STORAGE
// ============================================

export interface StoredReport {
  id: string
  user_id: string
  feature_key: string
  feature_title: string
  category: FeatureCategory
  input: string
  report: AIReport
  credits_used: number
  created_at: string
}

// ============================================
// TRANSACTION (for credit audit trail)
// ============================================

export interface CreditTransaction {
  id: string
  user_id: string
  transaction_type: 'purchase' | 'usage' | 'bonus' | 'refund' | 'signup'
  credits: number
  balance_before: number
  balance_after: number
  description: string
  reference_type: string
  reference_id: string
  created_at: string
}