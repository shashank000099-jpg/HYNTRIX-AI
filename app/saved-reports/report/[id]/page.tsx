'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../../../lib/auth-store'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Bookmark, Zap, TrendingUp, AlertTriangle, Lightbulb, Target, CheckCircle, FileText } from 'lucide-react'
import Link from 'next/link'

interface ReportData {
  id: string
  userId: string
  featureKey: string
  featureTitle: string
  category: string
  input: string
  scores: Record<string, number>
  overallScore: number
  verdict: string
  summary: string
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
  recommendations: string[]
  insights: string[]
  actionPlan: string[]
  riskLevel: 'low' | 'medium' | 'high'
  confidenceScore: number
  metadata?: Record<string, any>
  creditsUsed: number
  createdAt: string
  saved: boolean
}

export default function ReportDetailPage() {
  const { user, initialized } = useAuthStore()
  const router = useRouter()
  const params = useParams()
  const [report, setReport] = useState<ReportData | null>(null)
  const [metadata, setMetadata] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!initialized) return
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchReport()
  }, [user, initialized, params.id])

  async function fetchReport() {
    if (!user?.id || !params.id) return
    setLoading(true)
    try {
      const res = await fetch(`/api/reports/${params.id}`)
      const data = await res.json()

      if (data.success && data.report) {
        setReport(data.report)
        setMetadata(data.metadata)
      } else {
        setError(data.error || 'Report not found')
      }
    } catch (err) {
      console.error('Failed to fetch report:', err)
      setError('Failed to load report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function getScoreColor(score: number): string {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  function getScoreBg(score: number): string {
    if (score >= 80) return 'bg-green-500/10 border-green-500/20'
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/20'
    if (score >= 40) return 'bg-orange-500/10 border-orange-500/20'
    return 'bg-red-500/10 border-red-500/20'
  }

  function getRiskColor(level: string): string {
    switch (level) {
      case 'low': return 'text-green-400 bg-green-500/10'
      case 'medium': return 'text-yellow-400 bg-yellow-500/10'
      case 'high': return 'text-red-400 bg-red-500/10'
      default: return 'text-slate-400 bg-white/5'
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!initialized || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pt-20">
        <Link href="/saved-reports" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
          <ArrowLeft className="h-4 w-4" /> Back to Saved Reports
        </Link>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
          <p className="text-red-400">{error || 'Report not found'}</p>
          <Link href="/saved-reports" className="mt-4 inline-block text-sm text-blue-400 hover:text-blue-300">
            Go to Saved Reports →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <Link href="/saved-reports" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
        <ArrowLeft className="h-4 w-4" /> Back to Saved Reports
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-blue-400" />
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                {metadata?.feature_title || report.featureTitle || 'Report'}
              </span>
            </div>
            <h1 className="text-3xl font-semibold text-white">
              {metadata?.feature_title || report.featureTitle || 'Analysis Report'}
            </h1>
            {report.summary && (
              <p className="text-slate-400 max-w-2xl">{report.summary}</p>
            )}
          </div>
          <div className={`rounded-2xl border px-5 py-3 text-center ${getScoreBg(report.overallScore)}`}>
            <p className={`text-3xl font-bold ${getScoreColor(report.overallScore)}`}>{report.overallScore}</p>
            <p className="text-xs text-slate-500 mt-0.5">Overall Score</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-white/5">
          {metadata?.input && (
            <div className="text-xs text-slate-500">
              <span className="text-slate-400">Input:</span> {metadata.input.length > 60 ? metadata.input.slice(0, 60) + '...' : metadata.input}
            </div>
          )}
          <div className="text-xs text-slate-500 ml-auto">
            {formatDate(report.createdAt)}
          </div>
        </div>
      </div>

      {/* Verdict */}
      {report.verdict && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <FileText className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white mb-1">Verdict</p>
              <p className="text-slate-300 leading-relaxed">{report.verdict}</p>
            </div>
          </div>
        </div>
      )}

      {/* Scores Grid */}
      {Object.keys(report.scores).length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" /> Score Breakdown
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(report.scores).map(([key, value]) => (
              <div key={key} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                  {key.replace(/_/g, ' ')}
                </p>
                <p className={`text-2xl font-bold ${getScoreColor(value)}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk & Confidence */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Risk Level</p>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(report.riskLevel)}`}>
            {report.riskLevel.charAt(0).toUpperCase() + report.riskLevel.slice(1)}
          </span>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Confidence</p>
          <p className="text-2xl font-bold text-white">{report.confidenceScore}%</p>
        </div>
      </div>

      {/* Strengths */}
      {report.strengths.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" /> Strengths
          </h2>
          <div className="space-y-2">
            {report.strengths.map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-green-500/10 bg-green-500/5 p-4">
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weaknesses */}
      {report.weaknesses.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" /> Areas for Improvement
          </h2>
          <div className="space-y-2">
            {report.weaknesses.map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-red-500/10 bg-red-500/5 p-4">
                <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opportunities */}
      {report.opportunities.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-400" /> Opportunities
          </h2>
          <div className="space-y-2">
            {report.opportunities.map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-yellow-500/10 bg-yellow-500/5 p-4">
                <Lightbulb className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {report.recommendations.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-400" /> Recommendations
          </h2>
          <div className="space-y-2">
            {report.recommendations.map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-purple-500/10 bg-purple-500/5 p-4">
                <Target className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Plan */}
      {report.actionPlan.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-400" /> Action Plan
          </h2>
          <div className="space-y-2">
            {report.actionPlan.map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-sm text-slate-300 pt-1">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {report.insights.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Key Insights</h2>
          <div className="space-y-2">
            {report.insights.map((item, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
        <p className="text-xs text-slate-500">
          Generated with Hyntrix AI · {report.creditsUsed} credits used
        </p>
      </div>
    </div>
  )
}