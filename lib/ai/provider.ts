// ============================================
// UNIVERSAL AI PROVIDER ABSTRACTION
// ============================================
// Single entry point for ALL AI generation.
// Routes to Gemini (primary), Claude (future), OpenAI (future).
// No feature should call any AI provider directly.
// ============================================

import type { AIProvider, AIProviderConfig } from './types'

// ============================================
// DEFAULT PROVIDER: Gemini
// ============================================

function readEnv(name: string): string {
  return process.env[name]?.trim() || ''
}

function isUsableSecret(value: string): boolean {
  const normalized = value.trim().toLowerCase()
  return normalized.length > 0 && !normalized.startsWith('your_') && !normalized.includes('placeholder')
}

function getProviderConfig(provider: AIProvider): AIProviderConfig {
  switch (provider) {
    case 'gemini':
      return {
        provider: 'gemini',
        model: readEnv('GEMINI_MODEL') || 'gemini-3.5-flash',
        maxTokens: 4096,
        temperature: 0.7,
        apiKey: readEnv('GEMINI_API_KEY'),
      }
    case 'claude':
      return {
        provider: 'claude',
        model: readEnv('ANTHROPIC_MODEL') || readEnv('CLAUDE_MODEL') || 'claude-3-5-sonnet-20241022',
        maxTokens: 4096,
        temperature: 0.7,
        apiKey: readEnv('ANTHROPIC_API_KEY'),
      }
    case 'openai':
      return {
        provider: 'openai',
        model: readEnv('OPENAI_MODEL') || 'gpt-4o',
        maxTokens: 4096,
        temperature: 0.7,
        apiKey: readEnv('OPENAI_API_KEY'),
      }
  }
}

// ============================================
// PROVIDER RESPONSE INTERFACE
// ============================================

export interface ProviderResponse {
  text: string
  usage: {
    inputTokens: number
    outputTokens: number
  }
}

// ============================================
// PROVIDER REQUEST INTERFACE
// ============================================

export interface ProviderRequest {
  system: string
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[]
  temperature?: number
  maxTokens?: number
  responseSchema?: Record<string, any>
}

// ============================================
// CHECK IF A PROVIDER IS CONFIGURED
// ============================================

export function isProviderConfigured(provider?: AIProvider): boolean {
  const config = getProviderConfig(provider || 'gemini')
  return isUsableSecret(config.apiKey)
}

/**
 * Check if Gemini is configured (primary provider)
 */
export function isGeminiConfigured(): boolean {
  return isProviderConfigured('gemini')
}

/**
 * Get the active provider name
 */
export function getActiveProviderName(): string {
  if (isGeminiConfigured()) return `Gemini (${getProviderConfig('gemini').model})`
  if (isProviderConfigured('claude')) return `Claude (${getProviderConfig('claude').model})`
  if (isProviderConfigured('openai')) return `OpenAI (${getProviderConfig('openai').model})`
  return 'No AI provider configured'
}

// ============================================
// UNIVERSAL GENERATE FUNCTION
// ============================================
// Call this from ALL features. Never call providers directly.
// Automatically routes to the best available provider.
// ============================================

export async function generateResponse(request: ProviderRequest): Promise<ProviderResponse> {
  // Route to the best available provider
  if (isGeminiConfigured()) {
    return generateGeminiResponse(request)
  }
  if (isProviderConfigured('claude')) {
    return generateClaudeResponse(request)
  }
  if (isProviderConfigured('openai')) {
    return generateOpenAIResponse(request)
  }
  throw new Error(
    'No AI provider configured. Set GEMINI_API_KEY in your .env.local file. ' +
    'You can get a free Gemini API key at https://aistudio.google.com/apikey'
  )
}

// ============================================
// GEMINI GENERATION
// ============================================

async function generateGeminiResponse(request: ProviderRequest): Promise<ProviderResponse> {
  const config = getProviderConfig('gemini')

  // Build the Gemini API request payload
  const contents: any[] = []

  // System instruction goes first
  let systemInstruction = request.system

  // Add all messages
  for (const msg of request.messages) {
    if (msg.role === 'system') {
      systemInstruction = systemInstruction + '\n' + msg.content
    } else {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })
    }
  }

  const generationConfig: Record<string, any> = {
    temperature: request.temperature ?? config.temperature,
    maxOutputTokens: request.maxTokens ?? config.maxTokens,
  }

  if (request.responseSchema) {
    generationConfig.responseFormat = {
      text: {
        mimeType: 'APPLICATION_JSON',
        schema: request.responseSchema,
      },
    }
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': config.apiKey,
      },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        generationConfig,
      }),
    }
  )

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Gemini API error (${response.status}): ${errorBody}`)
  }

  const data = await response.json()

  const text = (data?.candidates || [])
    .flatMap((candidate: any) => candidate?.content?.parts || [])
    .map((part: any) => part?.text)
    .filter(Boolean)
    .join('\n')
    .trim()

  if (!text) {
    const reason = data?.promptFeedback?.blockReason || data?.candidates?.[0]?.finishReason || 'unknown reason'
    throw new Error(`Gemini returned no text (${reason})`)
  }

  const usage = data?.usageMetadata || {}

  return {
    text,
    usage: {
      inputTokens: usage.promptTokenCount || 0,
      outputTokens: usage.candidatesTokenCount || 0,
    },
  }
}

// ============================================
// CLAUDE GENERATION (Fallback)
// ============================================

async function generateClaudeResponse(request: ProviderRequest): Promise<ProviderResponse> {
  const config = getProviderConfig('claude')
  const system = [
    request.system,
    ...request.messages.filter((m) => m.role === 'system').map((m) => m.content),
  ].filter(Boolean).join('\n\n')

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: request.maxTokens || config.maxTokens,
      temperature: request.temperature ?? config.temperature,
      system,
      messages: request.messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({ role: m.role, content: m.content })),
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Claude API error (${response.status}): ${errorBody}`)
  }

  const data = await response.json()

  return {
    text: data.content[0]?.text || '',
    usage: {
      inputTokens: data.usage?.input_tokens || 0,
      outputTokens: data.usage?.output_tokens || 0,
    },
  }
}

// ============================================
// OPENAI GENERATION (Fallback)
// ============================================

async function generateOpenAIResponse(request: ProviderRequest): Promise<ProviderResponse> {
  const config = getProviderConfig('openai')

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: request.maxTokens || config.maxTokens,
      temperature: request.temperature ?? config.temperature,
      messages: [
        { role: 'system', content: request.system },
        ...request.messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`OpenAI API error (${response.status}): ${errorBody}`)
  }

  const data = await response.json()

  return {
    text: data.choices[0]?.message?.content || '',
    usage: {
      inputTokens: data.usage?.prompt_tokens || 0,
      outputTokens: data.usage?.completion_tokens || 0,
    },
  }
}

// ============================================
// PARSE JSON RESPONSE (handles markdown code blocks)
// ============================================

export function parseAIJSONResponse<T>(text: string): T {
  const trimmed = text.trim()

  // Try direct parse first
  try {
    return JSON.parse(trimmed) as T
  } catch {
    // Try to extract JSON from markdown code block
    const jsonMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1].trim()) as T
      } catch {
        throw new Error('Failed to parse AI response as JSON')
      }
    }

    const objectStart = trimmed.indexOf('{')
    const objectEnd = trimmed.lastIndexOf('}')
    if (objectStart !== -1 && objectEnd > objectStart) {
      try {
        return JSON.parse(trimmed.slice(objectStart, objectEnd + 1)) as T
      } catch {
        throw new Error('Failed to parse AI response as JSON')
      }
    }

    throw new Error('Failed to parse AI response as JSON')
  }
}

// ============================================
// ESTIMATE COST (based on active provider)
// ============================================

export function estimateAICost(inputTokens: number, outputTokens: number): number {
  if (isGeminiConfigured()) {
    // Gemini 1.5 Flash pricing: Free tier, then $0.075/M input, $0.30/M output
    const inputCost = (inputTokens / 1_000_000) * 0.075
    const outputCost = (outputTokens / 1_000_000) * 0.30
    return inputCost + outputCost
  }
  if (isProviderConfigured('claude')) {
    // Claude 3.5 Sonnet pricing: $3.00/M input, $15.00/M output
    const inputCost = (inputTokens / 1_000_000) * 3.0
    const outputCost = (outputTokens / 1_000_000) * 15.0
    return inputCost + outputCost
  }
  if (isProviderConfigured('openai')) {
    // GPT-4o pricing: $2.50/M input, $10.00/M output
    const inputCost = (inputTokens / 1_000_000) * 2.5
    const outputCost = (outputTokens / 1_000_000) * 10.0
    return inputCost + outputCost
  }
  return 0
}
