// ============================================
// AI SERVICE — DEPRECATED MOCK
// ============================================
// This file previously contained placeholder implementations.
// Now all AI generation goes through lib/ai/provider.ts
//
// The universal provider layer handles all AI generation:
// - gemini-1.5-flash (primary)
// - claude-3-5-sonnet (future fallback)
// - gpt-4o (future fallback)
//
// Import from lib/ai/provider.ts for new code.

export {
  generateResponse,
  isGeminiConfigured,
  isProviderConfigured,
  getActiveProviderName,
  parseAIJSONResponse,
  estimateAICost,
} from '../ai/provider'

export type { ProviderResponse, ProviderRequest } from '../ai/provider'

// Legacy interface for backward compatibility
export interface AICompletionRequest {
  provider: 'openai' | 'gemini' | 'anthropic'
  apiKey: string
  model: string
  systemPrompt: string
  userPrompt: string
  temperature?: number
  maxTokens?: number
}

export interface AICompletionResponse {
  content: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  provider: string
}