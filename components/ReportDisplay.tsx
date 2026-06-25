'use client'

import { motion } from 'framer-motion'
import type { StartupReport, FounderReport, SocialReport } from '../lib/types'
import { formatDate } from '../lib/utils'
import { PremiumScoreCard, PremiumBadge, ReviewEligibilityCard } from '../components/ui/PremiumBadge'
import { getPerformanceTier, isRecognitionEligible, isEliteEligible } from '../lib/performance-tiers'

interface ReportCardProps {
  report: StartupReport | FounderReport | SocialReport
  onSave?: () => void
  onDownload?: () => void
  onShare?: () => void
}

export default function ReportCard({ report, onSave, onDownload, onShare }: ReportCardProps) {
  const isStartupReport = 'startup_name' in report
  const isFounderReport = 'founder_type' in report
  const isSocialReport = 'platform' in report
  const r = report as any

  const score = isStartupReport ? r.total_score : isFounderReport ? r.score : isSocialReport ? r.growth_score : 0
  const tier = getPerformanceTier(score)
  const eligibleForReview = isRecognitionEligible(score)
  const isElite = isEliteEligible(score)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      {/* Premium Score Card */}
      <PremiumScoreCard
        score={score}
        label={isStartupReport ? 'Startup Score' : isSocialReport ? 'Creator Score' : 'Founder Score'}
        subtitle={`Performance Tier: ${tier.label}`}
      />

      {/* Recognition & Review Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <ReviewEligibilityCard
          isEligible={eligibleForReview}
          score={score}
          tierName={tier.label}
        />
        <div className={`rounded-2xl border p-5 ${isElite ? 'border-amber-500/20 bg-amber-500/5' : 'border-white/10 bg-white/5'}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{isElite ? '👑' : '📊'}</span>
            <div>
              <p className="text-sm font-semibold text-white">
                {isElite ? 'Leaderboard Eligible' : 'Leaderboard Status'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {isElite
                  ? `Score ${score} (${tier.label}) — may qualify for leaderboard ranking`
                  : `Score ${score} (${tier.label}) — higher scores may qualify for rankings`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isStartupReport ? r.startup_name : isFounderReport ? r.founder_type : r.username}
            </h2>
            <p className="text-gray-400 text-sm">
              Generated on {formatDate(r.created_at)}
            </p>
          </div>
          <PremiumBadge score={score} size="lg" pulse={eligibleForReview} />
        </div>

        {/* Verdict / Type */}
        {isStartupReport && r.verdict && (
          <div className="rounded-2xl bg-blue-500/10 border border-blue-500/30 p-4">
            <p className="text-sm text-gray-400 mb-1">AI Verdict</p>
            <p className="text-lg font-semibold text-blue-400">{r.verdict}</p>
          </div>
        )}

        {isFounderReport && (
          <div className="rounded-2xl bg-green-500/10 border border-green-500/30 p-4">
            <p className="text-sm text-gray-400 mb-1">Founder Type</p>
            <p className="text-lg font-semibold text-green-400">{r.founder_type}</p>
          </div>
        )}

        {isSocialReport && (
          <div className="rounded-2xl bg-purple-500/10 border border-purple-500/30 p-4">
            <p className="text-sm text-gray-400 mb-1">Platform</p>
            <p className="text-lg font-semibold text-purple-400 capitalize">{r.platform}</p>
          </div>
        )}

        {/* Recognition Status */}
        {isSocialReport && eligibleForReview && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">⭐</span>
              <div>
                <p className="text-sm font-semibold text-amber-400">Top Creator Recognition</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Outstanding creators may become eligible for: Creator Spotlight, Featured Rankings, Recognition Status, and Future Creator Programs.
                </p>
              </div>
            </div>
          </div>
        )}

        {isStartupReport && eligibleForReview && (
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">🚀</span>
              <div>
                <p className="text-sm font-semibold text-blue-400">Startup Recognition System</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Exceptional startup ideas may qualify for: Manual Review, Founder Spotlight, Startup Showcase, Growth Guidance, Development Assistance Consideration, and Future Opportunity Programs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Scores Grid */}
        {isStartupReport && (
          <div>
            <p className="text-sm font-semibold text-white mb-3">Category Scores</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-xs text-gray-500 mb-1">Market</p>
                <p className="text-xl font-bold text-white">{r.market_score}/100</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-xs text-gray-500 mb-1">Competition</p>
                <p className="text-xl font-bold text-white">{r.competition_score}/100</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-xs text-gray-500 mb-1">Revenue</p>
                <p className="text-xl font-bold text-white">{r.revenue_score}/100</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-xs text-gray-500 mb-1">Risk</p>
                <p className="text-xl font-bold text-white">{r.risk_score}/100</p>
              </div>
            </div>
          </div>
        )}

        {isSocialReport && (
          <div>
            <p className="text-sm font-semibold text-white mb-3">Category Scores</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-xs text-gray-500 mb-1">Growth</p>
                <p className="text-xl font-bold text-white">{r.growth_score}/100</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-xs text-gray-500 mb-1">Brand</p>
                <p className="text-xl font-bold text-white">{r.brand_score}/100</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-xs text-gray-500 mb-1">Trust</p>
                <p className="text-xl font-bold text-white">{r.trust_score}/100</p>
              </div>
            </div>
          </div>
        )}

        {/* Strengths */}
        {r.strengths && r.strengths.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">✅ Strengths</h3>
            <ul className="space-y-2">
              {r.strengths.map((strength: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-green-400 font-bold">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Weaknesses */}
        {r.weaknesses && r.weaknesses.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">⚠️ Weaknesses</h3>
            <ul className="space-y-2">
              {r.weaknesses.map((weakness: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-red-400 font-bold">•</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {isStartupReport && r.recommendations && r.recommendations.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">💡 Recommendations</h3>
            <ul className="space-y-2">
              {r.recommendations.map((rec: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-blue-400 font-bold">→</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Plan */}
        {(isStartupReport || isFounderReport) && r.action_plan && r.action_plan.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">🎯 Action Plan</h3>
            <ol className="space-y-2">
              {r.action_plan.map((action: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-yellow-400 font-bold">{idx + 1}.</span>
                  <span>{action}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Content Ideas */}
        {isSocialReport && r.content_ideas && r.content_ideas.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">📝 Content Ideas</h3>
            <ul className="space-y-2">
              {r.content_ideas.map((idea: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>{idea}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggestions */}
        {isSocialReport && r.suggestions && r.suggestions.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">🚀 Suggestions</h3>
            <ul className="space-y-2">
              {r.suggestions.map((suggestion: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-cyan-400 font-bold">→</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Shareable Ranking Card */}
        <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Share Your Ranking</p>
          <div className="flex items-center justify-center gap-4">
            <span className={`text-4xl font-bold ${tier.color}`}>{score}</span>
            <span className="text-sm text-slate-400">{tier.label}</span>
            <PremiumBadge score={score} />
          </div>
          <p className="text-xs text-slate-600 mt-3">
            Generated by HyntrixAI — Founder, Creator, Startup & Opportunity Discovery Ecosystem
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
          {onSave && (
            <button
              onClick={onSave}
              className="flex-1 px-4 py-2 rounded-xl bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 transition text-sm font-medium"
            >
              💾 Save Report
            </button>
          )}

          {onDownload && (
            <button
              onClick={onDownload}
              className="flex-1 px-4 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 transition text-sm font-medium"
            >
              📥 Download PDF
            </button>
          )}

          {onShare && (
            <button
              onClick={onShare}
              className="flex-1 px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 transition text-sm font-medium"
            >
              🔗 Share Report
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}