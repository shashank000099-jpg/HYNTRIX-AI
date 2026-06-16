// ============================================
// AI CLIENT — UNIVERSAL PROVIDER RE-EXPORT
// ============================================
// This file previously contained mock/placeholder implementations.
// Now all AI generation goes through lib/ai/provider.ts
//
// Any file that previously imported from this file should
// instead import directly from lib/ai/provider.ts

export {
  generateResponse,
  isGeminiConfigured,
  isProviderConfigured,
  getActiveProviderName,
  parseAIJSONResponse,
  estimateAICost,
} from './provider'

export type { ProviderResponse, ProviderRequest } from './provider'