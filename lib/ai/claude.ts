// ============================================
// CLAUDE API INTEGRATION
// ============================================
// Universal Claude 3.5 Sonnet provider for all features

import type { AIReport, FeatureCategory } from './types';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

export interface ClaudeMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ClaudeRequestOptions {
  system: string;
  messages: ClaudeMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface ClaudeResponse {
  content: { text: string }[];
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

/**
 * Check if Claude API is configured
 */
export function isClaudeConfigured(): boolean {
  return ANTHROPIC_API_KEY.length > 0 && ANTHROPIC_API_KEY !== 'your_anthropic_api_key_here';
}

/**
 * Send a request to Claude 3.5 Sonnet
 */
export async function generateClaudeResponse(
  options: ClaudeRequestOptions
): Promise<{ text: string; usage: { inputTokens: number; outputTokens: number } }> {
  if (!isClaudeConfigured()) {
    throw new Error(
      'Claude API is not configured. Set ANTHROPIC_API_KEY in your .env.local file.'
    );
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: options.maxTokens || 4096,
      temperature: options.temperature ?? 0.7,
      system: options.system,
      messages: options.messages,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Claude API error (${response.status}): ${errorBody}`);
  }

  const data: ClaudeResponse = await response.json();

  return {
    text: data.content[0]?.text || '',
    usage: {
      inputTokens: data.usage.input_tokens,
      outputTokens: data.usage.output_tokens,
    },
  };
}

/**
 * Parse a JSON response from Claude, handling markdown code blocks
 */
export function parseClaudeJSONResponse<T>(text: string): T {
  // Try direct parse first
  try {
    return JSON.parse(text) as T;
  } catch {
    // Try to extract JSON from markdown code block
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1].trim()) as T;
      } catch {
        throw new Error('Failed to parse Claude response as JSON');
      }
    }
    throw new Error('Failed to parse Claude response as JSON');
  }
}

/**
 * Estimate cost of a Claude API call
 */
export function estimateClaudeCost(inputTokens: number, outputTokens: number): number {
  // Claude 3.5 Sonnet pricing: $3.00/M input tokens, $15.00/M output tokens
  const inputCost = (inputTokens / 1_000_000) * 3.0;
  const outputCost = (outputTokens / 1_000_000) * 15.0;
  return inputCost + outputCost;
}