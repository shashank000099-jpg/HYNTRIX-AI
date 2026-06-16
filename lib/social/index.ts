// ============================================
// SOCIAL PLATFORM SERVICE LAYER
// ============================================
// Social scrapers (Phase 3) will be integrated here.
// All AI analysis for social features goes through lib/ai/provider.ts
// The social providers are in lib/ai/social-providers.ts

export type {
  SocialPlatform,
  SocialProfileData,
  SocialPostData,
  SocialProviderInterface,
} from '../ai/types'

export {
  getSocialProvider,
  isSocialProviderConfigured,
  getAllSocialProviders,
  getSocialPromptContext,
} from '../ai/social-providers'