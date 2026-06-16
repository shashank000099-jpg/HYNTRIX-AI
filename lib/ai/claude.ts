// ============================================
// CLAUDE API — RE-EXPORTS FROM UNIVERSAL PROVIDER
// ============================================
// Claude is now a fallback provider in the universal AI engine.
// All AI generation goes through lib/ai/provider.ts
// This file re-exports for backward compatibility.

import {
  generateResponse,
  isProviderConfigured,
  parseAIJSONResponse,
  estimateAICost,
} from './provider'

export {
  generateResponse,
  isProviderConfigured,
  getActiveProviderName,
  parseAIJSONResponse,
  estimateAICost,
} from './provider'

export type { ProviderResponse, ProviderRequest } from './provider'

// Backward compatibility: isClaudeConfigured → isProviderConfigured('claude')
export function isClaudeConfigured(): boolean {
  return isProviderConfigured('claude')
}

// Backward compatibility: generateClaudeResponse → generateResponse
export async function generateClaudeResponse(options: {
  system: string
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[]
  temperature?: number
  maxTokens?: number
}): Promise<{ text: string; usage: { inputTokens: number; outputTokens: number } }> {
  return generateResponse(options)
}

// Backward compatibility: parseClaudeJSONResponse → parseAIJSONResponse
export function parseClaudeJSONResponse<T>(text: string): T {
  return parseAIJSONResponse<T>(text)
}

// Backward compatibility: estimateClaudeCost → estimateAICost
export function estimateClaudeCost(inputTokens: number, outputTokens: number): number {
  return estimateAICost(inputTokens, outputTokens)
}