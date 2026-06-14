'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import CircularProgress from '../../components/charts/CircularProgress'
import { useAuthStore } from '../../lib/auth-store'
import { supabaseClient } from '../../lib/supabase/client'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [recentReports, setRecentReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecent() {
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
          .limit(4)

        if (saved) {
          setRecentReports(saved)
        }
      } catch (err) {
        console.error('Error fetching recent reports:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecent()
  }, [user?.id])

  const metrics = [
    { label: 'Strategy', value: 82, color: 'text-blue-400' },
    { label: 'Growth', value: 74, color: 'text-green-400' },
    { label: 'Funding', value: 68, color: 'text-purple-400' },
    { label: 'Momentum', value: 91, color: 'text-orange-400' }
  ]

  return (
    <div className="space-y-10">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Dashboard</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Founder OS command center</h1>
            </div>
            <Link href="/startup-intelligence" className="rounded-xl bg-blue-500/20 border border-blue-500/30 px-4 py-2 text-sm font-medium text-blue-300 hover:bg-blue-500/30 transition">
              New analysis
            </Link>
          </div>
          <p className="text-sm leading-7 text-slate-300">Monitor insights, saved reports, historical analysis and integration health from one premium workspace.</p>
          <div className="grid gap-4 md:grid-cols-2">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-slate-500">{metric.label}</p>
                <p className={`mt-3 text-3xl font-semibold ${metric.color}`}>{metric.value}%</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="grid gap-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Scoreboard</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Weekly momentum</h2>
            </div>
            <div className="rounded-3xl bg-white/5 px-3 py-2 text-sm text-slate-200">Updated now</div>
          </div>
          <div className="mx-auto">
            <CircularProgress value={78} />
          </div>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-6 xl:grid-cols-3">
        {[
          { title: 'Startup Intelligence', desc: 'Launch-ready reviews', icon: '🚀', href: '/startup-intelligence', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30' },
          { title: 'Social Intelligence', desc: 'Brand signal audits', icon: '📱', href: '/social-intelligence', color: 'from-pink-500/20 to-pink-600/10 border-pink-500/30' },
          { title: 'Founder Hub', desc: 'Progress & gamification', icon: '🏆', href: '/founder-hub', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30' }
        ].map((section) => (
          <Link key={section.href} href={section.href as any}>
            <motion.div whileHover={{ y: -4 }} className={`rounded-[2rem] border p-7 bg-gradient-to-br ${section.color}`}>
              <span className="text-3xl">{section.icon}</span>
              <p className="mt-3 text-sm uppercase tracking-[0.22em] text-slate-500">{section.title}</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">{section.desc}</h3>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Recent Reports</h2>
          <Link href="/history" className="text-sm font-medium text-blue-400 hover:text-blue-300">View all →</Link>
        </div>
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
          </div>
        ) : recentReports.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-slate-400">No reports yet. Start by analyzing your startup!</p>
            <Link href="/startup-intelligence" className="mt-4 inline-block text-sm font-medium text-blue-400 hover:text-blue-300">
              Analyze Your Startup →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {recentReports.map((report) => (
              <div key={report.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-slate-300 capitalize">{report.report_type}</span>
                    <h3 className="mt-2 text-base font-semibold text-white">{report.title || 'Untitled Report'}</h3>
                    {report.subtitle && <p className="mt-1 text-xs text-slate-400">{report.subtitle}</p>}
                  </div>
                  {report.score != null && (
                    <div className="rounded-xl bg-white/5 px-3 py-1 text-sm font-semibold text-white">{report.score}</div>
                  )}
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  {new Date(report.saved_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}