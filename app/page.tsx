'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuthStore } from '../lib/auth-store'
import { useCreditsStore } from '../lib/credits-store'
import { useEffect, useState } from 'react'
import { supabaseClient } from '../lib/supabase/client'
import { Zap, TrendingUp, Bookmark, ArrowRight, Sparkles, Shield, Cpu, BarChart3 } from 'lucide-react'

const quickActions = [
  { title: 'Startup Judge', description: 'Analyze your startup for viability', href: '/startup-intelligence/startup-judge', icon: '⚖️', credits: 20 },
  { title: 'Founder DNA', description: 'Discover your leadership profile', href: '/founder-intelligence/founder-dna', icon: '🧬', credits: 20 },
  { title: 'Opportunity Finder', description: 'Spot market gaps and opportunities', href: '/opportunity-hub/opportunity-finder', icon: '💡', credits: 20 },
  { title: 'Startup Roast', description: 'Get honest feedback on your business', href: '/startup-intelligence/startup-roast', icon: '🔥', credits: 20 },
  { title: 'Instagram Analyzer', description: 'Analyze Instagram growth and brand', href: '/social-intelligence/instagram-analyzer', icon: '📸', credits: 20 },
  { title: 'AI Client Finder', description: 'Find high-value clients with AI', href: '/ai-client-finder', icon: '🎯', credits: 20 },
]

const sections = [
  { title: 'Startup Intelligence', desc: 'Judge, roast, scan your startup', href: '/startup-intelligence', icon: '🚀', count: 7 },
  { title: 'Founder Intelligence', desc: 'DNA, score, leadership analysis', href: '/founder-intelligence', icon: '🧬', count: 7 },
  { title: 'Social Intelligence', desc: 'Analyze Instagram, YouTube, X', href: '/social-intelligence', icon: '📱', count: 10 },
  { title: 'AI Client Finder', desc: 'Find high-value clients', href: '/ai-client-finder', icon: '🎯', count: 1 },
]

function LandingPage() {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section - Apple style */}
      <section className="relative pt-20 pb-8 md:pt-32 md:pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
          className="relative text-center space-y-8 max-w-4xl mx-auto px-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            Premium AI Intelligence for Founders
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight">
            Build Smarter.
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-2">
              Launch Faster.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed font-[425]">
            Analyze your startup, discover your founder DNA, find clients, and get expert AI advice — all powered by premium AI intelligence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/auth/signup" 
              className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/buy-credits" 
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all duration-300 backdrop-blur-sm"
            >
              View Pricing
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid - Apple inspired */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Premium AI Intelligence
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Every analysis costs 20 credits. No subscriptions, no hidden fees.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((section, i) => (
            <motion.div 
              key={section.href} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={section.href as any}>
                <div className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.03] p-8 transition-all duration-500 hover:bg-white/[0.06] hover:border-white/[0.1] hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-start justify-between mb-4">
                    <span className="text-4xl">{section.icon}</span>
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                      20 credits each
                    </span>
                  </div>
                  <div className="relative">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">{section.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{section.desc}</p>
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-400 group-hover:text-blue-300 transition-colors">
                      <span>Explore {section.count} tools</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing - Apple style */}
      <section className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Simple Credit-Based Pricing
          </h2>
          <p className="text-lg text-slate-400">No subscriptions. Buy credits, use them anytime.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { credits: 20, price: '₹22', label: 'Quick Access', desc: 'Single report' },
            { credits: 100, price: '₹99', label: 'Starter', desc: '5 reports', popular: true },
            { credits: 250, price: '₹199', label: 'Most Popular', desc: '12+ reports', popular: true },
          ].map((pack, i) => (
            <motion.div 
              key={pack.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`relative rounded-3xl border p-8 text-center transition-all duration-500 hover:scale-[1.02] ${
                pack.popular 
                  ? 'border-blue-500/30 bg-gradient-to-b from-blue-500/10 to-blue-500/5 shadow-lg shadow-blue-500/10' 
                  : 'border-white/[0.06] bg-white/[0.03] hover:border-white/[0.1]'
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold shadow-lg">
                    Popular
                  </span>
                </div>
              )}
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-2">{pack.label}</p>
              <p className="text-5xl font-bold text-white mt-4 mb-1 tracking-tight">{pack.price}</p>
              <p className="text-sm text-slate-400">{pack.credits} Credits — {pack.desc}</p>
              <Link 
                href="/buy-credits"
                className={`mt-6 inline-block w-full py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                  pack.popular
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25'
                    : 'border border-white/10 text-white hover:bg-white/5'
                }`}
              >
                Get Started
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center">
          <Link 
            href="/buy-credits" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] text-white font-medium text-sm transition-all duration-300"
          >
            View All Packs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 text-center space-y-6">
        <div className="rounded-3xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-12 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Ready to Start?</h2>
          <p className="text-lg text-slate-400">Join founders building smarter with AI intelligence</p>
          <Link 
            href="/auth/signup" 
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-600/25"
          >
            Create Free Account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

function AuthenticatedHome() {
  const { user } = useAuthStore()
  const { balance: liveCredits, fetchBalance } = useCreditsStore()
  const [recentReports, setRecentReports] = useState<any[]>([])
  const [recentHistory, setRecentHistory] = useState<any[]>([])
  const [reportCount, setReportCount] = useState(0)
  const [historyCount, setHistoryCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) fetchBalance(user.id)
    async function fetchData() {
      if (!supabaseClient || !user?.id) {
        setLoading(false)
        return
      }
      try {
        const { data: saved } = await supabaseClient
          .from('saved_reports')
          .select('*')
          .eq('user_id', user.id)
          .order('saved_at', { ascending: false })
          .limit(3)

        const { data: history } = await supabaseClient
          .from('history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)

        if (saved) setRecentReports(saved)
        if (history) setRecentHistory(history)
        // Get total counts
        const { count: savedCount } = await supabaseClient
          .from('saved_reports')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
        const { count: histCount } = await supabaseClient
          .from('history')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
        if (savedCount) setReportCount(savedCount)
        if (histCount) setHistoryCount(histCount)
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user?.id])

  if (!user) return null

  const stats = [
    { label: 'Credits Available', value: liveCredits, icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Reports Generated', value: historyCount, icon: BarChart3, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Saved Reports', value: reportCount, icon: Bookmark, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Level', value: user.level, icon: Shield, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ]

  return (
    <div className="space-y-12 pb-12">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Welcome back</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Hey, {user.name || 'Founder'}! 👋
          </h1>
          <p className="text-lg text-slate-400 max-w-xl">Your premium AI intelligence is ready. What would you like to analyze today?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((stat) => (
            <div 
              key={stat.label} 
              className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.1]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
          <Link href="/startup-intelligence" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            View all tools →
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {quickActions.map((action, index) => (
            <motion.div 
              key={action.href} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.03, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={action.href as any}>
                <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.1] hover:scale-[1.02]">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{action.icon}</span>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                      {action.credits} credits
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">{action.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{action.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="grid gap-3 md:grid-cols-2">
        {sections.map((section) => (
          <Link key={section.href} href={section.href as any}>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.1]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{section.icon}</span>
                <span className="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20">
                  {section.count} tools
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{section.title}</h3>
              <p className="text-sm text-slate-400">{section.desc}</p>
              <p className="mt-3 text-sm font-medium text-blue-400 group-hover:text-blue-300 transition-colors">
                Explore →
              </p>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Recent History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Recent History</h2>
          <Link href="/history" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            View all →
          </Link>
        </div>
        {recentHistory.length > 0 ? (
          <div className="space-y-2">
            {recentHistory.map((item, i) => (
              <motion.div 
                key={item.id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 transition-all duration-300 hover:bg-white/[0.06]"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.feature || item.feature_name || 'AI Analysis'}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.credits_used ? `${item.credits_used} credits` : '20 credits'}
                    {' · '}
                    {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <span className="text-xs text-slate-500 capitalize">{item.status || 'completed'}</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 text-center">
            <p className="text-sm text-slate-500">No history yet. Your first analysis will appear here.</p>
          </div>
        )}
      </div>

      {/* Saved Reports */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Saved Reports</h2>
          <Link href="/saved-reports" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
          </div>
        ) : recentReports.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 text-center">
            <Bookmark className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">No reports yet. Start by analyzing your startup!</p>
            <Link href="/startup-intelligence" className="mt-3 inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Analyze Your Startup
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {recentReports.map((report, i) => (
              <motion.div 
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 transition-all duration-300 hover:bg-white/[0.06]"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-slate-300 capitalize border border-white/10">
                    {report.report_type}
                  </span>
                  {report.score != null && (
                    <span className="text-sm font-semibold text-white">{report.score}</span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-white">{report.title || 'Untitled Report'}</h3>
                {report.subtitle && <p className="text-xs text-slate-400 mt-1">{report.subtitle}</p>}
                <p className="text-xs text-slate-500 mt-3">
                  {new Date(report.saved_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function HomePage() {
  const { user, initialized } = useAuthStore()

  if (!initialized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-b-blue-500/20 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
        </div>
      </div>
    )
  }

  if (!user) {
    return <LandingPage />
  }

  return <AuthenticatedHome />
}