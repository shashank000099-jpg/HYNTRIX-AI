// ============================================
// UNIVERSAL REPORT BUILDER
// ============================================
// Transforms AI provider responses into structured AIReport objects
// Provider-agnostic — works with Gemini, Claude, OpenAI

import type { AIReport, FeatureCategory, FeatureRegistryEntry } from './types'
import { getFeatureByKey } from '../features/registry'

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Build a complete AIReport from a parsed AI response
 * Works with ANY provider (Gemini, Claude, OpenAI)
 */
export function buildReport(params: {
  featureKey: string
  userId: string
  input: string
  aiResponse: Record<string, any>
  creditsUsed: number
}): AIReport {
  const feature = getFeatureByKey(params.featureKey)

  // Normalize scores - AI may return them as an object or array
  const scores = normalizeScores(params.aiResponse.scores)

  const now = new Date().toISOString()

  return {
    id: generateId(),
    userId: params.userId,
    featureKey: params.featureKey,
    featureTitle: feature?.title || params.featureKey,
    category: (feature?.category as FeatureCategory) || 'startup-intelligence',
    input: params.input,
    scores,
    overallScore: params.aiResponse.overallScore ?? calculateOverallScore(scores),
    verdict: params.aiResponse.verdict || 'Analysis complete.',
    summary: params.aiResponse.summary || generateDefaultSummary(scores, feature),
    strengths: ensureArray(params.aiResponse.strengths),
    weaknesses: ensureArray(params.aiResponse.weaknesses),
    opportunities: ensureArray(params.aiResponse.opportunities),
    threats: ensureArray(params.aiResponse.threats),
    recommendations: ensureArray(params.aiResponse.recommendations),
    insights: ensureArray(params.aiResponse.insights, [
      'Analysis based on provided inputs',
      'Recommendations are data-informed estimates',
      'Regular reassessment is recommended as conditions change',
    ]),
    actionPlan: ensureArray(params.aiResponse.actionPlan, [
      'Review all recommendations and prioritize by impact',
      'Create a timeline for implementing top priorities',
      'Track progress against the recommended milestones',
      'Reassess and adjust strategy as needed',
      'Scale successful approaches and iterate on others',
    ]),
    riskLevel: validateRiskLevel(params.aiResponse.riskLevel),
    confidenceScore: params.aiResponse.confidenceScore ?? 75,
    metadata: extractMetadata(params.aiResponse, feature),
    creditsUsed: params.creditsUsed,
    createdAt: now,
    saved: false,
  }
}

/**
 * Normalize scores from various formats the AI might return
 */
function normalizeScores(scores: any): Record<string, number> {
  if (!scores || typeof scores !== 'object') {
    return { overall: 0 }
  }

  const result: Record<string, number> = {}
  for (const [key, value] of Object.entries(scores)) {
    if (typeof value === 'number') {
      result[key] = Math.min(100, Math.max(0, value))
    } else if (typeof value === 'string') {
      const parsed = parseInt(value, 10)
      result[key] = isNaN(parsed) ? 0 : Math.min(100, Math.max(0, parsed))
    }
  }
  return result
}

/**
 * Calculate overall score from individual scores
 */
function calculateOverallScore(scores: Record<string, number>): number {
  const values = Object.values(scores)
  if (values.length === 0) return 0
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
}

/**
 * Ensure a value is an array of strings
 */
function ensureArray(value: any, fallback: string[] = []): string[] {
  if (Array.isArray(value)) {
    return value.filter((v) => typeof v === 'string' && v.length > 0)
  }
  if (typeof value === 'string') {
    return [value]
  }
  return fallback
}

/**
 * Validate risk level
 */
function validateRiskLevel(level: any): 'low' | 'medium' | 'high' {
  if (level === 'low' || level === 'medium' || level === 'high') {
    return level
  }
  return 'medium'
}

/**
 * Generate a default summary based on scores
 */
function generateDefaultSummary(scores: Record<string, number>, feature?: FeatureRegistryEntry): string {
  const overall = calculateOverallScore(scores)
  const featureName = feature?.title || 'Analysis'

  if (overall >= 80) {
    return `${featureName} shows strong potential. Key metrics indicate favorable conditions with manageable risks. Focus on execution and scaling identified strengths.`
  } else if (overall >= 60) {
    return `${featureName} shows moderate potential. Several areas need attention before proceeding confidently. Address the identified weaknesses to improve outcomes.`
  } else if (overall >= 40) {
    return `${featureName} shows significant concerns. Multiple risk factors need to be addressed before committing significant resources. Consider pivoting or gathering more data.`
  } else {
    return `${featureName} shows critical issues that need immediate attention. High risk of negative outcomes with current approach. Major restructuring or alternative approaches recommended.`
  }
}

/**
 * Extract additional metadata from AI response
 */
function extractMetadata(response: Record<string, any>, feature?: FeatureRegistryEntry): Record<string, any> {
  const metadata: Record<string, any> = {}

  // Include any extra fields that don't match the standard schema
  const standardFields = new Set([
    'scores', 'overallScore', 'verdict', 'summary', 'strengths', 'weaknesses',
    'opportunities', 'threats', 'recommendations', 'insights', 'actionPlan',
    'riskLevel', 'confidenceScore',
  ])

  for (const [key, value] of Object.entries(response)) {
    if (!standardFields.has(key)) {
      metadata[key] = value
    }
  }

  metadata.featureCategory = feature?.category

  return metadata
}