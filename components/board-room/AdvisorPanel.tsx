'use client'

import { useState } from 'react'
import type { FeatureDefinition } from '../../lib/types'
import { useAuthStore } from '../../lib/auth-store'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import LoadingOverlay from '../ui/LoadingOverlay'
import CreditGate from '../ui/CreditGate'
import type { FeatureType } from '../../lib/credits'
import type { AIReport } from '../../lib/ai/types'
import { useCreditsStore } from '../../lib/credits-store'
import { MessageSquare, Lightbulb, TrendingUp, Scale } from 'lucide-react'

const advisorIcons: Record<string, React.ReactNode> = {
  'product-advisor': <Lightbulb className="h-8 w-8 text-blue-400" />,
  'growth-advisor': <TrendingUp className="h-8 w-8 text-green-400" />,
  'finance-advisor': <Scale className="h-8 w-8 text-yellow-400" />,
  'legal-advisor': <MessageSquare className="h-8 w-8 text-purple-400" />,
}

export default function AdvisorPanel({ advisor }: { advisor: FeatureDefinition }) {
  const { user } = useAuthStore()
  const { fetchBalance } = useCreditsStore()
  const [report, setReport] = useState<AIReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null)

  const handleGenerate = async () => {
    if (!user?.id) return
    if (!query || query.length < 3) {
      setError('Please describe what you need advice on')
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
          featureKey: advisor.key,
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
        setError(data.error || 'Failed to get advice')
        setLoading(false)
        return
      }

      if (data.report) {
        setReport(data.report as AIReport)
        setRemainingCredits(data.remainingCredits)
      } else {
        setError('No advice received')
      }

      if (user?.id) {
        fetchBalance(user.id)
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred. Your credits were NOT deducted.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              {advisorIcons[advisor.key] || <Lightbulb className="h-8 w-8 text-slate-400" />}
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{advisor.title}</p>
              <h1 className="text-2xl font-semibold text-white mt-1">{advisor.description}</h1>
              <p className="text-sm text-slate-400 mt-1">Describe your situation and get AI-powered advice</p>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-200">What do you need advice on?</label>
            <Input
              placeholder="Describe your product, challenge, or question..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        {loading ? <LoadingOverlay label="Getting AI advice..." /> : null}
      </Card>

      <CreditGate
        feature={advisor.key as FeatureType}
        onGenerate={handleGenerate}
        loading={loading}
      >
        <div />
      </CreditGate>

      {report && (
        <div className="space-y-6">
          {/* Verdict & Summary */}
          <Card>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400 mb-3">AI Verdict</p>
                <p className="text-lg font-semibold text-white">{report.verdict}</p>
                {report.summary && (
                  <p className="mt-3 text-sm text-slate-400">{report.summary}</p>
                )}
                <div className="mt-4 flex items-center gap-3">
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
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-400 mb-2">Strengths</p>
                  <ul className="space-y-1 text-sm text-slate-300">
                    {report.strengths.map((item: string) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-400 mb-2">Areas to Address</p>
                  <ul className="space-y-1 text-sm text-slate-300">
                    {report.weaknesses.map((item: string) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Recommendations */}
          <Card>
            <div className="p-5">
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400 mb-4">Recommendations</p>
              <ol className="space-y-3">
                {report.recommendations.map((item: string, i: number) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-300">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-semibold text-xs">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </Card>

          {/* Action Plan */}
          {report.actionPlan && report.actionPlan.length > 0 && (
            <Card>
              <div className="p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400 mb-4">Action Plan</p>
                <div className="space-y-3">
                  {report.actionPlan.map((step: string, i: number) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-semibold text-xs">
                        {i + 1}
                      </span>
                      <p className="text-sm text-slate-300">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {remainingCredits !== null && (
            <p className="text-xs text-slate-500 text-center">{remainingCredits} credits remaining</p>
          )}
        </div>
      )}
    </div>
  )
}