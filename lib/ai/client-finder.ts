// ============================================
// AI CLIENT FINDER — DEPRECATED MOCK (PHASE 4)
// ============================================
// This file contained mock/placeholder implementations.
// The real Client Finder engine is in client-finder-engine.ts
// All AI generation goes through lib/ai/provider.ts
//
// This file now re-exports from the real implementation.

export type {
  ClientFinderSearchRequest,
  LeadResult,
  ClientFinderReport,
} from './types'

export { clientFinderEngine, CLIENT_FINDER_CONFIG } from './client-finder-engine'