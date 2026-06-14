// ============================================
// AI SERVICE LAYER - ARCHITECTURE ONLY
// ============================================
// This file defines the architecture for future AI integration.
// DO NOT integrate Gemini or OpenAI APIs yet.
// 
// Phase 2 will implement:
//   - Gemini API integration
//   - OpenAI API integration
//   - Report generation
//   - Analysis

export interface AIProviderConfig {
  gemini?: {
    apiKey: string
    model: string
  }
  openai?: {
    apiKey: string
    model: string
  }
}

export interface AIRequest {
  prompt: string
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
  provider: 'gemini' | 'openai'
}

export interface AIResponse {
  text: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  error?: string
}

/**
 * Future: Generate a report using configured AI provider
 * Currently returns a placeholder indicating "Coming Soon"
 */
export async function generateReport(request: AIRequest): Promise<AIResponse> {
  console.warn('AI integration not yet implemented. Phase 2 will add Gemini/OpenAI.')
  return {
    text: 'AI analysis is coming soon. This feature will be available in the next update.',
    error: 'AI integration not configured'
  }
}

/**
 * Future: Generate analysis using configured AI provider
 */
export async function analyzeData(request: AIRequest): Promise<AIResponse> {
  console.warn('AI integration not yet implemented. Phase 2 will add Gemini/OpenAI.')
  return {
    text: 'AI analysis is coming soon.',
    error: 'AI integration not configured'
  }
}

/**
 * Future: Stream a response from AI provider
 */
export async function* streamResponse(request: AIRequest): AsyncGenerator<string> {
  console.warn('AI integration not yet implemented.')
  yield 'AI streaming will be available in Phase 2.'
}