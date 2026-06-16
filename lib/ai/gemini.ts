// ============================================
// GEMINI 1.5 FLASH — PRIMARY AI PROVIDER
// ============================================
// This file re-exports from the universal provider layer.
// All AI generation goes through lib/ai/provider.ts
// ============================================

export {
  generateResponse,
  isGeminiConfigured,
  isProviderConfigured,
  getActiveProviderName,
  parseAIJSONResponse,
  estimateAICost,
} from './provider'

export type { ProviderResponse, ProviderRequest } from './provider'