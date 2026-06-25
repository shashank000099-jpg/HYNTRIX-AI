// ============================================
// PERFORMANCE TIERS & RECOGNITION SYSTEM
// ============================================

export type PerformanceTier = 'developing' | 'rising' | 'strong' | 'advanced' | 'elite' | 'exceptional'

export interface TierInfo {
  key: PerformanceTier
  label: string
  range: [number, number]
  color: string
  bgColor: string
  borderColor: string
  badge: string
  description: string
}

export const PERFORMANCE_TIERS: Record<PerformanceTier, TierInfo> = {
  developing: {
    key: 'developing',
    label: 'Developing',
    range: [0, 59],
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/20',
    badge: '🌱',
    description: 'Early stage with significant room for growth',
  },
  rising: {
    key: 'rising',
    label: 'Rising',
    range: [60, 74],
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    badge: '📈',
    description: 'Showing promising growth and potential',
  },
  strong: {
    key: 'strong',
    label: 'Strong',
    range: [75, 84],
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    badge: '💪',
    description: 'Solid performance with clear strengths',
  },
  advanced: {
    key: 'advanced',
    label: 'Advanced',
    range: [85, 89],
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    badge: '⭐',
    description: 'High-performing with advanced capabilities',
  },
  elite: {
    key: 'elite',
    label: 'Elite',
    range: [90, 94],
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    badge: '🏆',
    description: 'Top-tier performance — exceptional potential',
  },
  exceptional: {
    key: 'exceptional',
    label: 'Exceptional',
    range: [95, 100],
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/20',
    badge: '👑',
    description: 'Rare outstanding performance — may qualify for recognition',
  },
}

export function getPerformanceTier(score: number): TierInfo {
  if (score >= 95) return PERFORMANCE_TIERS.exceptional
  if (score >= 90) return PERFORMANCE_TIERS.elite
  if (score >= 85) return PERFORMANCE_TIERS.advanced
  if (score >= 75) return PERFORMANCE_TIERS.strong
  if (score >= 60) return PERFORMANCE_TIERS.rising
  return PERFORMANCE_TIERS.developing
}

export function getTierBadge(score: number): string {
  return getPerformanceTier(score).badge
}

export function getTierLabel(score: number): string {
  return getPerformanceTier(score).label
}

export function getTierColor(score: number): string {
  return getPerformanceTier(score).color
}

export function isRecognitionEligible(score: number): boolean {
  return score >= 85
}

export function isEliteEligible(score: number): boolean {
  return score >= 90
}

// ============================================
// RECOGNITION STATUS
// ============================================

export type RecognitionStatus = 'none' | 'reviewing' | 'recognized' | 'featured'

export interface RecognitionInfo {
  status: RecognitionStatus
  label: string
  description: string
  color: string
  bgColor: string
}

export const RECOGNITION_STATUSES: Record<RecognitionStatus, RecognitionInfo> = {
  none: {
    status: 'none',
    label: 'Standard',
    description: 'Not currently under review',
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
  },
  reviewing: {
    status: 'reviewing',
    label: 'Under Review',
    description: 'Being reviewed by the HyntrixAI team',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  recognized: {
    status: 'recognized',
    label: 'Recognized',
    description: 'Recognized for exceptional performance',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
  },
  featured: {
    status: 'featured',
    label: 'Featured',
    description: 'Featured in HyntrixAI spotlight programs',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
  },
}

// ============================================
// LEADERBOARD CATEGORIES
// ============================================

export type LeaderboardCategory =
  | 'top-startups'
  | 'top-founders'
  | 'top-creators'
  | 'top-influencers'
  | 'rising-talent'
  | 'exceptional-performers'

export interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  score: number
  tier: PerformanceTier
  badge: string
  recognitionStatus: RecognitionStatus
  category: string
  description: string
}

// ============================================
// OPPORTUNITY STATUS
// ============================================

export type OpportunityStatus = 'eligible' | 'reviewing' | 'selected' | 'featured'

export interface OpportunityInfo {
  status: OpportunityStatus
  label: string
  description: string
  color: string
  bgColor: string
  icon: string
}

export const OPPORTUNITY_STATUSES: Record<OpportunityStatus, OpportunityInfo> = {
  eligible: {
    status: 'eligible',
    label: 'May Be Eligible',
    description: 'May qualify for review and recognition',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    icon: '✨',
  },
  reviewing: {
    status: 'reviewing',
    label: 'Under Review',
    description: 'Being reviewed by the HyntrixAI team',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    icon: '🔍',
  },
  selected: {
    status: 'selected',
    label: 'Selected',
    description: 'Selected for opportunity programs',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    icon: '✅',
  },
  featured: {
    status: 'featured',
    label: 'Featured',
    description: 'Featured in HyntrixAI programs',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    icon: '🌟',
  },
}

// ============================================
// ACHIEVEMENT BADGES
// ============================================

export interface AchievementBadge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  bgColor: string
  requirement: string
}

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: 'first-analysis',
    name: 'First Analysis',
    description: 'Completed your first AI analysis',
    icon: '🔬',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    requirement: 'Complete 1 analysis',
  },
  {
    id: 'rising-star',
    name: 'Rising Star',
    description: 'Achieved Rising tier or higher',
    icon: '⭐',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    requirement: 'Score 60+ on any analysis',
  },
  {
    id: 'strong-performer',
    name: 'Strong Performer',
    description: 'Achieved Strong tier or higher',
    icon: '💪',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    requirement: 'Score 75+ on any analysis',
  },
  {
    id: 'elite-achiever',
    name: 'Elite Achiever',
    description: 'Achieved Elite tier',
    icon: '🏆',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    requirement: 'Score 90+ on any analysis',
  },
  {
    id: 'exceptional',
    name: 'Exceptional',
    description: 'Achieved Exceptional tier',
    icon: '👑',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    requirement: 'Score 95+ on any analysis',
  },
  {
    id: 'serial-analyzer',
    name: 'Serial Analyzer',
    description: 'Completed 10 analyses',
    icon: '📊',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    requirement: 'Complete 10 analyses',
  },
  {
    id: 'startup-expert',
    name: 'Startup Expert',
    description: 'Analyzed 5+ startup ideas',
    icon: '🚀',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    requirement: 'Analyze 5 startups',
  },
  {
    id: 'social-savvy',
    name: 'Social Savvy',
    description: 'Analyzed 5+ social profiles',
    icon: '📱',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    requirement: 'Analyze 5 social profiles',
  },
]
