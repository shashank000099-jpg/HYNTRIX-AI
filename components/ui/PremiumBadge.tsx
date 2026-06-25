'use client'

import { motion } from 'framer-motion'
import { getPerformanceTier, type TierInfo } from '../../lib/performance-tiers'

interface PremiumBadgeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  showLabel?: boolean
  pulse?: boolean
}

export function PremiumBadge({ score, size = 'md', showIcon = true, showLabel = true, pulse = false }: PremiumBadgeProps) {
  const tier: TierInfo = getPerformanceTier(score)

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide ${sizeClasses[size]} ${tier.bgColor} ${tier.borderColor} border ${tier.color} ${pulse ? 'animate-pulse' : ''}`}
    >
      {showIcon && <span>{tier.badge}</span>}
      {showLabel && <span>{tier.label}</span>}
    </motion.div>
  )
}

interface TierBadgeProps {
  tier: TierInfo
  size?: 'sm' | 'md' | 'lg'
}

export function TierBadge({ tier, size = 'md' }: TierBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  }

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide ${sizeClasses[size]} ${tier.bgColor} ${tier.borderColor} border ${tier.color}`}>
      <span>{tier.badge}</span>
      <span>{tier.label}</span>
    </div>
  )
}

interface ScoreCardProps {
  score: number
  label?: string
  subtitle?: string
  className?: string
}

export function PremiumScoreCard({ score, label = 'Score', subtitle, className = '' }: ScoreCardProps) {
  const tier: TierInfo = getPerformanceTier(score)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl border ${tier.borderColor} bg-gradient-to-br ${tier.bgColor.replace('/10', '/20').replace('/10', '/10')} p-6 ${className}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl" />
      <div className="relative space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
        <div className="flex items-end gap-3">
          <span className={`text-5xl font-bold tracking-tight ${tier.color}`}>{score}</span>
          <span className="text-sm text-slate-500 mb-1">/ 100</span>
        </div>
        {subtitle && (
          <p className="text-sm text-slate-400">{subtitle}</p>
        )}
        <div className="flex items-center gap-2 pt-2">
          <PremiumBadge score={score} />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </motion.div>
  )
}

interface RankingCardProps {
  rank: number
  score: number
  title: string
  subtitle?: string
  badge?: string
}

export function RankingCard({ rank, score, title, subtitle, badge }: RankingCardProps) {
  const tier: TierInfo = getPerformanceTier(score)

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/[0.07] transition-colors"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
        <span className="text-lg font-bold text-white">#{rank}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{title}</p>
        {subtitle && <p className="text-xs text-slate-400 truncate">{subtitle}</p>}
      </div>
      <div className="flex-shrink-0 text-right">
        <span className={`text-lg font-bold ${tier.color}`}>{score}</span>
        <PremiumBadge score={score} size="sm" showLabel={false} />
      </div>
      {badge && (
        <div className="flex-shrink-0">
          <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-slate-400 border border-white/10">
            {badge}
          </span>
        </div>
      )}
    </motion.div>
  )
}

interface OpportunityCardProps {
  title: string
  description: string
  icon: string
  gradient?: string
  href?: string
}

export function OpportunityCard({ title, description, icon, gradient = 'from-blue-500/10 to-blue-600/5', href }: OpportunityCardProps) {
  const content = (
    <motion.div
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br ${gradient} p-6 h-full transition-all duration-500 hover:border-white/[0.12]`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative space-y-3">
        <span className="text-3xl">{icon}</span>
        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )

  if (href) {
    return <a href={href}>{content}</a>
  }

  return content
}

interface RecognitionWidgetProps {
  status: string
  label: string
  description?: string
  icon?: string
}

export function RecognitionWidget({ status, label, description, icon = '🏆' }: RecognitionWidgetProps) {
  const statusColors: Record<string, string> = {
    eligible: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400',
    pending: 'border-yellow-500/20 bg-yellow-500/5 text-yellow-400',
    recognized: 'border-purple-500/20 bg-purple-500/5 text-purple-400',
    featured: 'border-pink-500/20 bg-pink-500/5 text-pink-400',
  }

  const colorClass = statusColors[status] || 'border-white/10 bg-white/5 text-slate-400'

  return (
    <div className={`rounded-xl border p-4 ${colorClass}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-sm font-semibold">{label}</p>
          {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
        </div>
      </div>
    </div>
  )
}

interface ReviewEligibilityCardProps {
  isEligible: boolean
  score: number
  tierName: string
}

export function ReviewEligibilityCard({ isEligible, score, tierName }: ReviewEligibilityCardProps) {
  return (
    <div className={`rounded-2xl border p-5 ${isEligible ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-white/10 bg-white/5'}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{isEligible ? '✅' : '🔍'}</span>
        <div>
          <p className="text-sm font-semibold text-white">
            {isEligible ? 'Eligible for Review' : 'Review Status'}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {isEligible
              ? `Score ${score} (${tierName}) — may be reviewed by the HyntrixAI Team`
              : `Score ${score} (${tierName}) — higher scores may qualify for review`}
          </p>
        </div>
      </div>
    </div>
  )
}

interface AchievementBadgeProps {
  title: string
  icon: string
  description?: string
  unlocked?: boolean
}

export function AchievementBadge({ title, icon, description, unlocked = true }: AchievementBadgeProps) {
  return (
    <div className={`relative rounded-xl border p-4 text-center transition-all duration-300 ${
      unlocked
        ? 'border-white/10 bg-white/5 hover:bg-white/[0.07]'
        : 'border-white/[0.03] bg-white/[0.02] opacity-40'
    }`}>
      <span className="text-3xl block mb-2">{icon}</span>
      <p className={`text-xs font-semibold ${unlocked ? 'text-white' : 'text-slate-500'}`}>{title}</p>
      {description && <p className="text-[10px] text-slate-500 mt-1">{description}</p>}
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-slate-600">🔒 Locked</span>
        </div>
      )}
    </div>
  )
}