'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from './ui/Button'
import Input from './ui/Input'
import Card from './ui/Card'
import LoadingOverlay from './ui/LoadingOverlay'
import CircularProgress from './charts/CircularProgress'
import CreditGate from './ui/CreditGate'
import type { FeatureType } from '../lib/credits'
import { useAuthStore } from '../lib/auth-store'
import { useCreditsStore } from '../lib/credits-store'
import type { AIReport } from '../lib/ai/types'
import { PremiumBadge, PremiumScoreCard, ReviewEligibilityCard } from './ui/PremiumBadge'
import { getPerformanceTier, isEliteEligible, isRecognitionEligible } from '../lib/performance-tiers'
import { Award, BarChart3, Crown, ShieldCheck, Sparkles, Trophy } from 'lucide-react'

const workspaceSchema = z.object({
  query: z.string().min(3, 'Enter a valid prompt')
})

type WorkspaceValues = z.infer<typeof workspaceSchema>

interface FeatureWorkspaceProps {
  title: string
  description: string
  inputLabel?: string
  featureKey: string
}

function getReportKind(report: AIReport): 'startup' | 'founder' | 'creator' | 'analysis' {
  if (report.category === 'startup-intelligence') return 'startup'
  if (report.category === 'founder-intelligence') return 'founder'
  if (report.category === 'social-intelligence') return 'creator'
  return 'analysis'
}

function getEstimatedRank(score: number): string {
  if (score >= 95) return 'Top 1%'
  if (score >= 90) return 'Top 5%'
  if (score >= 85) return 'Top 10%'
  if (score >= 75) return 'Top 25%'
  if (score >= 60) return 'Rising pool'
  return 'Developing pool'
}

function getOpportunityStatus(score: number): string {
  if (score >= 95) return 'May be considered for exceptional review'
  if (score >= 90) return 'May qualify for elite recognition'
  if (score >= 85) return 'May be eligible for manual review'
  if (score >= 75) return 'Strong improvement path identified'
  return 'Needs stronger evidence before review'
}

function getMetadataList(report: AIReport, keys: string[]): string[] {
  for (const key of keys) {
    const value = report.metadata?.[key]
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string' && item.length > 0)
    }
    if (typeof value === 'string' && value.length > 0) {
      return [value]
    }
  }
  return []
}

export default function FeatureWorkspace({ title, description, inputLabel, featureKey }: FeatureWorkspaceProps) {
  const { user } = useAuthStore()
  const { fetchBalance } = useCreditsStore()
  const [report, setReport] = useState<AIReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [shared, setShared] = useState(false)
  const [generateCount, setGenerateCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null)

  const form = useForm<WorkspaceValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: { query: '' }
  })

  const handleGenerate = async () => {
    if (!user?.id) return

    const query = form.getValues('query')
    if (!query || query.length < 3) {
      setError('Please enter at least 3 characters')
      return
    }

    setLoading(true)
    setError(null)
    setReport(null)

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featureKey: featureKey,
          input: query,
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 402) {
          setError(data.error || 'Insufficient credits. Please buy more credits.')
          setLoading(false)
          return
        }
        if (response.status === 502) {
          setError(data.error || 'AI generation failed. Please try again.')
          setLoading(false)
          return
        }
        setError(data.error || 'Failed to generate report')
        setLoading(false)
        return
      }

      if (data.report) {
        setReport(data.report as AIReport)
        setRemainingCredits(data.remainingCredits)
      } else {
        setError('No report data received')
      }

      setGenerateCount(prev => prev + 1)

      if (user?.id) {
        fetchBalance(user.id)
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred. Your credits were NOT deducted.')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (!report) return
    try {
      await navigator.share({
        title: `${report.featureTitle} Report - HYNTRIX AI`,
        text: `${report.featureTitle} analysis: ${report.verdict} (Score: ${report.overallScore}/100)`,
        url: window.location.href,
      })
    } catch {
      try {
        await navigator.clipboard.writeText(
          `${report.featureTitle} Report - HYNTRIX AI\n\n${report.verdict}\nScore: ${report.overallScore}/100\n\nView: ${window.location.href}`
        )
        setShared(true)
        setTimeout(() => setShared(false), 3000)
      } catch {
        // Ignore clipboard errors
      }
    }
  }

  const handleDownloadPDF = async () => {
    if (!report || !user?.id) return

    try {
      const tier = getPerformanceTier(report.overallScore)
      const printContent = `
HYNTRIX AI - ${report.featureTitle} Report
Date: ${new Date(report.createdAt).toLocaleDateString()}
Score: ${report.overallScore}/100
Performance Tier: ${tier.label}
Confidence Level: ${report.confidenceScore}/100
Estimated Rank: ${getEstimatedRank(report.overallScore)}
Leaderboard Eligibility: ${isEliteEligible(report.overallScore) ? 'May qualify' : 'Not currently eligible'}
Review Status: ${isRecognitionEligible(report.overallScore) ? 'May be reviewed' : 'Higher score needed for review'}
Opportunity Status: ${getOpportunityStatus(report.overallScore)}
Risk Level: ${report.riskLevel.toUpperCase()}

VERDICT:
${report.verdict}

${report.summary ? `SUMMARY:\n${report.summary}\n` : ''}

STRENGTHS:
${report.strengths.map(s => `- ${s}`).join('\n')}

WEAKNESSES:
${report.weaknesses.map(w => `- ${w}`).join('\n')}

RECOMMENDATIONS:
${report.recommendations.map(r => `- ${r}`).join('\n')}

ACTION PLAN:
${report.actionPlan.map((a, i) => `${i + 1}. ${a}`).join('\n')}

Generated by HYNTRIX AI - Founder, Creator, Startup & Opportunity Discovery Ecosystem
      `.trim()

      const blob = new Blob([printContent], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${report.featureKey}-report-${Date.now()}.txt`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      window.print()
    }
  }

  const getScoreMetrics = () => {
    if (!report?.scores) return defaultMetrics
    return Object.entries(report.scores).map(([key, value]) => ({
      label: key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()),
      value: typeof value === 'number' ? value : 0,
    }))
  }

  const reportKind = report ? getReportKind(report) : 'analysis'
  const reportTier = report ? getPerformanceTier(report.overallScore) : null
  const reviewEligible = report ? isRecognitionEligible(report.overallScore) : false
  const leaderboardEligible = report ? isEliteEligible(report.overallScore) : false
  const blindSpots = report ? getMetadataList(report, ['blindSpots', 'blind_spots']) : []
  const growthOpportunities = report
    ? getMetadataList(report, ['growthOpportunities', 'growth_opportunities', 'creatorGrowthOpportunities'])
    : []
  const improvementRoadmap = report
    ? getMetadataList(report, ['improvementRoadmap', 'improvement_roadmap', 'roadmap'])
    : []

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <Card className="relative overflow-hidden">
          <div className="space-y-4">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{title}</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">{description}</h1>
              <p className="mt-3 text-sm leading-7 text-slate-300">Use the AI operating system to generate fast insights, analysis, and recommendations.</p>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form className="space-y-4" onSubmit={form.handleSubmit(() => {})}>
              <label className="block text-sm font-medium text-slate-200">{inputLabel ?? 'Enter your business details'}</label>
              <Input
                placeholder="Share details for analysis"
                {...form.register('query')}
              />
              {form.formState.errors.query ? (
                <p className="text-sm text-red-400">{form.formState.errors.query.message}</p>
              ) : null}
            </form>
          </div>
          {loading ? <LoadingOverlay label={generateCount > 0 ? 'Regenerating report...' : 'Generating AI-powered analysis...'} /> : null}
        </Card>

        <Card>
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Report Snapshot</p>
            <div className="rounded-[2rem] bg-slate-950/50 p-6">
              <CircularProgress value={report?.overallScore ?? 0} />
            </div>
            {report && (
              <div className="text-center">
                <p className="text-xs text-slate-500">
                  {remainingCredits !== null ? `${remainingCredits} credits remaining` : ''}
                </p>
              </div>
            )}
            <div className="space-y-3">
              {getScoreMetrics().map((metric) => (
                <div key={metric.label} className="rounded-3xl bg-white/5 p-4">
                  <div className="text-sm text-slate-400">{metric.label}</div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
                    <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${metric.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Credit Gate */}
      <CreditGate
        feature={featureKey as FeatureType}
        onGenerate={handleGenerate}
        loading={loading}
      >
        <div />
      </CreditGate>

      {/* AI Report Results */}
      {report ? (
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <p className="text-xs text-slate-500">
            Generated {generateCount} time{generateCount !== 1 ? 's' : ''} — {report.creditsUsed} credits used
            {report.confidenceScore ? ` · ${report.confidenceScore}/100 confidence` : ''}
          </p>

          {reportTier && (
            <div className="grid gap-4 xl:grid-cols-[1.1fr_1.4fr]">
              <PremiumScoreCard
                score={report.overallScore}
                label={
                  reportKind === 'startup'
                    ? 'Final Startup Score'
                    : reportKind === 'creator'
                      ? 'Creator Score'
                      : reportKind === 'founder'
                        ? 'Founder Score'
                        : 'Final Score'
                }
                subtitle={`Performance Tier: ${reportTier.label}`}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <ReviewEligibilityCard
                  isEligible={reviewEligible}
                  score={report.overallScore}
                  tierName={reportTier.label}
                />
                <div className={`rounded-2xl border p-5 ${leaderboardEligible ? 'border-amber-500/20 bg-amber-500/5' : 'border-white/10 bg-white/5'}`}>
                  <div className="flex items-start gap-3">
                    <Trophy className={`mt-0.5 h-5 w-5 ${leaderboardEligible ? 'text-amber-400' : 'text-slate-500'}`} />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {leaderboardEligible ? 'Leaderboard Eligible' : 'Leaderboard Status'}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        {leaderboardEligible
                          ? `Score ${report.overallScore} may qualify for ranking visibility.`
                          : 'Elite scores of 90+ may qualify for ranking visibility.'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-start gap-3">
                    <BarChart3 className="mt-0.5 h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {reportKind === 'startup' ? 'Startup Rank' : reportKind === 'creator' ? 'Creator Rank' : 'Estimated Rank'}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        {getEstimatedRank(report.overallScore)} based on calibrated tier thresholds.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-5 w-5 text-purple-400" />
                    <div>
                      <p className="text-sm font-semibold text-white">Opportunity Status</p>
                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        {getOpportunityStatus(report.overallScore)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {reportTier && (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-400" />
                  <div>
                    <p className="text-sm font-semibold text-white">Confidence Level</p>
                    <p className="mt-1 text-2xl font-bold text-white">{report.confidenceScore}/100</p>
                    <p className="mt-1 text-xs text-slate-500">AI confidence in available evidence</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start gap-3">
                  <Award className="mt-0.5 h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="text-sm font-semibold text-white">Recognition Status</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      {reviewEligible ? 'May be reviewed for recognition.' : 'Not currently eligible for recognition review.'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start gap-3">
                  <Crown className="mt-0.5 h-5 w-5 text-rose-400" />
                  <div>
                    <p className="text-sm font-semibold text-white">Performance Tier</p>
                    <div className="mt-2">
                      <PremiumBadge score={report.overallScore} pulse={reviewEligible} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Verdict & Summary */}
          <Card>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
                <h2 className="text-xl font-semibold text-white">AI Verdict</h2>
                <p className="mt-3 max-w-xl text-slate-300">{report.verdict}</p>
                {report.summary && (
                  <p className="mt-3 text-sm text-slate-400">{report.summary}</p>
                )}
                <div className="mt-6 flex items-center gap-3">
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    report.riskLevel === 'low' ? 'bg-green-500/20 text-green-400' :
                    report.riskLevel === 'high' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {report.riskLevel.toUpperCase()} RISK
                  </span>
                  <span className="text-sm text-slate-400">Score: {report.overallScore}/100</span>
                </div>
              </div>
              <div className="space-y-4 rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Strengths</p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-300">
                    {report.strengths.map((item: string) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Weaknesses</p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-300">
                    {report.weaknesses.map((item: string) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Opportunities, Threats, Recommendations */}
          <Card>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Opportunities</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {report.opportunities.map((item: string) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Risks</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {report.threats.map((item: string) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Recommendations</p>
                <ol className="mt-4 space-y-2 text-sm text-slate-300 list-decimal pl-5">
                  {report.recommendations.map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>
            </div>
          </Card>

          {(blindSpots.length > 0 || growthOpportunities.length > 0 || improvementRoadmap.length > 0) && (
            <Card>
              <div className="grid gap-6 lg:grid-cols-3">
                {blindSpots.length > 0 && (
                  <div className="rounded-3xl border border-red-500/10 bg-red-500/5 p-5">
                    <p className="text-sm uppercase tracking-[0.22em] text-red-300/80">Blind Spots</p>
                    <ul className="mt-4 space-y-2 text-sm text-slate-300">
                      {blindSpots.map((item: string) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {growthOpportunities.length > 0 && (
                  <div className="rounded-3xl border border-emerald-500/10 bg-emerald-500/5 p-5">
                    <p className="text-sm uppercase tracking-[0.22em] text-emerald-300/80">Growth Opportunities</p>
                    <ul className="mt-4 space-y-2 text-sm text-slate-300">
                      {growthOpportunities.map((item: string) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {improvementRoadmap.length > 0 && (
                  <div className="rounded-3xl border border-blue-500/10 bg-blue-500/5 p-5">
                    <p className="text-sm uppercase tracking-[0.22em] text-blue-300/80">Improvement Roadmap</p>
                    <ol className="mt-4 space-y-2 text-sm text-slate-300 list-decimal pl-5">
                      {improvementRoadmap.map((item: string) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Insights */}
          {report.insights && report.insights.length > 0 && (
            <Card>
              <div className="p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500 mb-4">Key Insights</p>
                <div className="grid gap-4 md:grid-cols-3">
                  {report.insights.map((insight: string, i: number) => (
                    <div key={i} className="rounded-xl bg-blue-500/5 border border-blue-500/10 p-4">
                      <p className="text-sm text-slate-300">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Action Plan */}
          {report.actionPlan && report.actionPlan.length > 0 && (
            <Card>
              <div className="p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500 mb-4">Action Plan</p>
                <div className="space-y-3">
                  {report.actionPlan.map((step: string, i: number) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-semibold mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-slate-300">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {reportTier && (
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent p-6 text-center">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Shareable Ranking Card</p>
              <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <span className={`text-5xl font-bold tracking-tight ${reportTier.color}`}>{report.overallScore}</span>
                <div className="text-center sm:text-left">
                  <p className="text-lg font-semibold text-white">{reportTier.label}</p>
                  <p className="text-xs text-slate-500">
                    {getEstimatedRank(report.overallScore)} · {getOpportunityStatus(report.overallScore)}
                  </p>
                </div>
                <PremiumBadge score={report.overallScore} size="lg" pulse={reviewEligible} />
              </div>
              <p className="mx-auto mt-4 max-w-2xl text-xs leading-6 text-slate-500">
                Generated by HyntrixAI, a Founder, Creator, Startup, and Opportunity Discovery Ecosystem. Recognition, reviews, rankings, and future programs are not guaranteed.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={handleShare}>{shared ? '✓ Shared!' : 'Share Report'}</Button>
            <Button variant="ghost" onClick={handleDownloadPDF}>Download Report</Button>
          </div>
        </motion.div>
      ) : null}
    </div>
  )
}

const defaultMetrics = [
  { label: 'Market Demand', value: 0 },
  { label: 'Competition', value: 0 },
  { label: 'Revenue Potential', value: 0 },
  { label: 'Risk', value: 0 },
]
