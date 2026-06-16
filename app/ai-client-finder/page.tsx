'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../../lib/auth-store'
import { useCreditsStore } from '../../lib/credits-store'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import LoadingOverlay from '../../components/ui/LoadingOverlay'
import CircularProgress from '../../components/charts/CircularProgress'
import CreditGate from '../../components/ui/CreditGate'
import type { LeadResult } from '../../lib/ai/types'
import { Zap, Target, Building2, MapPin, TrendingUp, MessageSquare, DollarSign, Users } from 'lucide-react'

const clientFinderSchema = z.object({
  businessType: z.string().min(3, 'Enter your service type'),
  location: z.string().min(1, 'Enter target location'),
  keywords: z.string().min(3, 'Enter keywords'),
  industry: z.string().optional(),
  companySize: z.string().optional(),
})

type ClientFinderValues = z.infer<typeof clientFinderSchema>

export default function AIClientFinderPage() {
  const { user } = useAuthStore()
  const { fetchBalance } = useCreditsStore()
  const [leads, setLeads] = useState<LeadResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null)
  const [searchComplete, setSearchComplete] = useState(false)
  const [averageScore, setAverageScore] = useState(0)
  const [selectedLead, setSelectedLead] = useState<LeadResult | null>(null)

  const form = useForm<ClientFinderValues>({
    resolver: zodResolver(clientFinderSchema),
    defaultValues: {
      businessType: '',
      location: '',
      keywords: '',
      industry: '',
      companySize: '',
    }
  })

  const handleSearch = async () => {
    if (!user?.id) return

    const values = form.getValues()
    if (!values.businessType || !values.location || !values.keywords) {
      setError('Please fill in required fields')
      return
    }

    setLoading(true)
    setError(null)
    setLeads([])
    setSearchComplete(false)
    setSelectedLead(null)

    try {
      const response = await fetch('/api/ai/client-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          serviceType: values.businessType,
          targetIndustry: values.industry || undefined,
          targetLocation: values.location,
          keywords: values.keywords.split(',').map(k => k.trim()).filter(Boolean),
          companySize: values.companySize || undefined,
          maxResults: 15,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 402) {
          setError(data.error || 'Insufficient credits. Please buy more credits.')
          setLoading(false)
          return
        }
        setError(data.error || 'Failed to find clients')
        setLoading(false)
        return
      }

      if (data.leads && Array.isArray(data.leads)) {
        setLeads(data.leads)
        setRemainingCredits(data.remainingCredits)
        setAverageScore(data.averageFitScore || 0)
        setSearchComplete(true)
      } else {
        setError('No leads data received')
      }

      if (user?.id) {
        fetchBalance(user.id)
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-r from-green-500 to-emerald-400'
    if (score >= 60) return 'bg-gradient-to-r from-yellow-500 to-orange-400'
    return 'bg-gradient-to-r from-red-500 to-rose-400'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">AI Client Finder</p>
        <h1 className="text-4xl font-semibold text-white">Find High-Value Clients</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">
          Use AI-powered business intelligence to discover potential clients, analyze their fit, and get outreach recommendations.
        </p>
      </div>

      {/* Search Form */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <Card className="relative overflow-hidden">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Client Search</h2>
              <p className="mt-1 text-sm text-slate-400">Describe your ideal client profile to find matching leads</p>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form className="space-y-4" onSubmit={form.handleSubmit(() => {})}>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">Your Service/Business Type *</label>
                <Input
                  placeholder="e.g., Web Development, Marketing Agency, SaaS Consulting"
                  {...form.register('businessType')}
                />
                {form.formState.errors.businessType && (
                  <p className="text-sm text-red-400 mt-1">{form.formState.errors.businessType.message}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">Target Location *</label>
                  <Input
                    placeholder="e.g., San Francisco, USA, Remote"
                    {...form.register('location')}
                  />
                  {form.formState.errors.location && (
                    <p className="text-sm text-red-400 mt-1">{form.formState.errors.location.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">Target Industry</label>
                  <Input
                    placeholder="e.g., Healthcare, Fintech, E-commerce"
                    {...form.register('industry')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">Keywords *</label>
                <Input
                  placeholder="e.g., digital transformation, growth stage, series A"
                  {...form.register('keywords')}
                />
                {form.formState.errors.keywords && (
                  <p className="text-sm text-red-400 mt-1">{form.formState.errors.keywords.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">Company Size</label>
                <Input
                  placeholder="e.g., 1-10, 10-50, 50-200, 200+"
                  {...form.register('companySize')}
                />
              </div>
            </form>
          </div>
          {loading ? <LoadingOverlay label="Finding ideal clients with AI..." /> : null}
        </Card>

        <Card>
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Lead Overview</p>
            <div className="rounded-[2rem] bg-slate-950/50 p-6">
              <CircularProgress value={searchComplete ? averageScore : 0} />
            </div>
            {searchComplete && (
              <div className="text-center space-y-2">
                <p className="text-2xl font-bold text-white">{leads.length} Leads Found</p>
                <p className="text-xs text-slate-500">
                  {remainingCredits !== null ? `${remainingCredits} credits remaining` : ''}
                </p>
              </div>
            )}
            {!searchComplete && (
              <div className="text-center text-sm text-slate-400">
                <p>Fill in the form and search</p>
                <p className="text-xs mt-1">20 credits per search</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Credit Gate */}
      <CreditGate
        feature="ai-client-finder"
        onGenerate={handleSearch}
        loading={loading}
      >
        <div />
      </CreditGate>

      {/* Results */}
      {searchComplete && leads.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Matching Leads</h2>
            <p className="text-sm text-slate-400">{leads.length} leads · Avg fit: {averageScore}/100</p>
          </div>

          {/* Lead Cards */}
          <div className="grid gap-4">
            {leads.map((lead, index) => (
              <motion.div
                key={lead.companyName + index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 hover:border-blue-500/30 transition cursor-pointer"
                onClick={() => setSelectedLead(selectedLead?.companyName === lead.companyName ? null : lead)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <h3 className="text-lg font-semibold text-white truncate">{lead.companyName}</h3>
                      <span className={`text-sm font-semibold ${getScoreColor(lead.fitScore)}`}>
                        {lead.fitScore}/100
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {lead.location || 'Remote'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" /> {lead.industry}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" /> {lead.size || 'N/A'}
                      </span>
                      {lead.funding && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" /> {lead.funding}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-24">
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${getScoreBarColor(lead.fitScore)}`}
                        style={{ width: `${lead.fitScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Expandable Details */}
                {selectedLead?.companyName === lead.companyName && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-white/10 space-y-4"
                  >
                    {/* Tech Stack */}
                    {lead.techStack && lead.techStack.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500 mb-2">Tech Stack</p>
                        <div className="flex flex-wrap gap-2">
                          {lead.techStack.map((tech, i) => (
                            <span key={i} className="px-2 py-1 rounded-md bg-white/5 text-xs text-slate-300">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Decision Makers */}
                    {lead.decisionMakers && lead.decisionMakers.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500 mb-2">Decision Makers</p>
                        <div className="space-y-2">
                          {lead.decisionMakers.map((dm, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <Users className="h-3 w-3 text-slate-400" />
                              <span className="text-slate-300">{dm.name}</span>
                              <span className="text-slate-500">— {dm.role}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Opportunity Summary */}
                    {lead.opportunitySummary && (
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500 mb-2">Opportunity</p>
                        <p className="text-sm text-slate-300">{lead.opportunitySummary}</p>
                      </div>
                    )}

                    {/* Outreach Message */}
                    {lead.outreachMessage && (
                      <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
                        <div className="flex items-start gap-3">
                          <MessageSquare className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-blue-400 mb-1">Outreach Message</p>
                            <p className="text-sm text-slate-300">{lead.outreachMessage}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Buying Intent & Conversion */}
                    <div className="flex flex-wrap gap-4">
                      {lead.buyingIntent && (
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="h-4 w-4 text-blue-400" />
                          <span className="text-slate-300">Buying Intent:</span>
                          <span className={`font-semibold ${
                            lead.buyingIntent === 'High' ? 'text-green-400' :
                            lead.buyingIntent === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                          }`}>{lead.buyingIntent}</span>
                        </div>
                      )}
                      {lead.estimatedBudget && (
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-green-400" />
                          <span className="text-slate-300">Budget:</span>
                          <span className="font-semibold text-green-400">{lead.estimatedBudget}</span>
                        </div>
                      )}
                      {lead.conversionProbability && (
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="h-4 w-4 text-purple-400" />
                          <span className="text-slate-300">Conversion:</span>
                          <span className="font-semibold text-purple-400">{lead.conversionProbability}%</span>
                        </div>
                      )}
                    </div>

                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Summary Card */}
          <Card>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-white mb-4">Search Summary</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-2xl font-bold text-white">{leads.length}</p>
                  <p className="text-xs text-slate-400">Total Leads</p>
                </div>
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-2xl font-bold text-white">{averageScore}/100</p>
                  <p className="text-xs text-slate-400">Avg Fit Score</p>
                </div>
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-2xl font-bold text-white">
                    {leads.filter(l => l.fitScore >= 80).length}
                  </p>
                  <p className="text-xs text-slate-400">High-Fit Leads</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* No Results */}
      {searchComplete && leads.length === 0 && !loading && (
        <Card>
          <div className="p-8 text-center">
            <Zap className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Leads Found</h3>
            <p className="text-sm text-slate-400">
              Try broadening your search criteria or using different keywords.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}