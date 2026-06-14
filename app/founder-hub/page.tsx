'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Card from '../../components/ui/Card'
import { useAuthStore } from '../../lib/auth-store'

const quickLinks = [
  { title: 'XP & Points', description: 'Track your experience points and progress', href: '/founder-hub/xp', icon: '⚡', color: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30' },
  { title: 'Levels', description: 'See your current level and what unlocks next', href: '/founder-hub/levels', icon: '🏆', color: 'from-green-500/20 to-green-600/10 border-green-500/30' },
  { title: 'Achievements', description: 'View earned badges and unlock new ones', href: '/founder-hub/achievements', icon: '🎖️', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30' },
  { title: 'Challenges', description: 'Complete daily and weekly challenges', href: '/founder-hub/challenges', icon: '🎯', color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30' }
]

export default function FounderHubPage() {
  const { user } = useAuthStore()

  const stats = [
    { label: 'XP', value: user?.xp?.toLocaleString() || '0', detail: `${(user?.level || 1) * 1000 - (user?.xp || 0)} XP to next level`, icon: '⚡', color: 'text-yellow-400' },
    { label: 'Streak', value: '0 days', detail: 'Daily actions completed', icon: '🔥', color: 'text-orange-400' },
    { label: 'Level', value: `${user?.level || 1}`, detail: 'Founder rank', icon: '🏆', color: 'text-green-400' },
    { label: 'Reports', value: '0', detail: 'Total generated', icon: '📊', color: 'text-blue-400' },
    { label: 'Plan', value: (user?.plan || 'Free').toUpperCase(), detail: 'Current subscription', icon: '💎', color: 'text-purple-400' },
    { label: 'Challenges', value: '0/3', detail: 'Daily completed today', icon: '🎯', color: 'text-cyan-400' }
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Founder Hub</p>
        <h1 className="text-4xl font-semibold text-white">Track progress, achievements and streaks</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">A gamified founder journey with XP, levels, badges, and daily opportunities for growth.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span>{stat.icon}</span>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
            </div>
            <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.detail}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href as any}>
            <div className={`group rounded-2xl border bg-gradient-to-br ${link.color} p-5 transition hover:-translate-y-1 cursor-pointer`}>
              <span className="text-2xl">{link.icon}</span>
              <h3 className="mt-3 text-lg font-semibold text-white">{link.title}</h3>
              <p className="mt-2 text-xs text-slate-400 leading-5">{link.description}</p>
              <p className="mt-3 text-xs font-medium text-blue-400 group-hover:text-blue-300">View →</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Daily Opportunity & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Daily Opportunity</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Launch a conversion experiment</h2>
            </div>
            <Link href="/startup-intelligence" className="rounded-xl bg-blue-500/20 border border-blue-500/30 px-4 py-2 text-sm font-medium text-blue-300 hover:bg-blue-500/30 transition">
              Run now
            </Link>
          </div>
          <p className="text-sm leading-7 text-slate-300">Use your founder momentum to test a new landing page angle, email sequence or social campaign.</p>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Quick Stats</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
              <div>
                <p className="text-sm text-white">Current Level</p>
                <p className="text-xs text-slate-400">Founder rank progression</p>
              </div>
              <span className="text-sm font-semibold text-green-400">Level {user?.level || 1}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
              <div>
                <p className="text-sm text-white">Total XP</p>
                <p className="text-xs text-slate-400">Experience points earned</p>
              </div>
              <span className="text-sm font-semibold text-yellow-400">{user?.xp || 0} XP</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
              <div>
                <p className="text-sm text-white">Available Credits</p>
                <p className="text-xs text-slate-400">For AI analyses</p>
              </div>
              <span className="text-sm font-semibold text-blue-400">{user?.credits || 0}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}