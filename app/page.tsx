'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuthStore } from '../lib/auth-store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const quickActions = [
  { title: 'Startup Judge', description: 'Analyze your startup for viability and market fit', href: '/startup-intelligence/startup-judge', icon: '⚖️', color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/30', badge: 'Free' },
  { title: 'Founder DNA', description: 'Discover your leadership profile and strengths', href: '/founder-intelligence/founder-dna', icon: '🧬', color: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/30', badge: 'Free' },
  { title: 'Opportunity Finder', description: 'Spot high-value market gaps and opportunities', href: '/opportunity-hub/opportunity-finder', icon: '💡', color: 'from-green-500/20 to-green-600/10', border: 'border-green-500/30', badge: 'Free' },
  { title: 'Startup Roast', description: 'Get brutal honest feedback on your business', href: '/startup-intelligence/startup-roast', icon: '🔥', color: 'from-orange-500/20 to-orange-600/10', border: 'border-orange-500/30', badge: 'Pro' },
  { title: 'Instagram Analyzer', description: 'Analyze your Instagram growth and brand signals', href: '/social-intelligence/instagram-analyzer', icon: '📸', color: 'from-pink-500/20 to-pink-600/10', border: 'border-pink-500/30', badge: 'Pro' },
  { title: 'Shark Tank Simulator', description: 'Practice your pitch with AI sharks', href: '/simulators/shark-tank-simulator', icon: '🦈', color: 'from-cyan-500/20 to-cyan-600/10', border: 'border-cyan-500/30', badge: 'Pro' },
  { title: 'Board Room', description: 'Get advice from 4 expert AI advisors', href: '/board-room', icon: '💼', color: 'from-indigo-500/20 to-indigo-600/10', border: 'border-indigo-500/30', badge: 'Pro' },
  { title: 'Death Scanner', description: 'Find fatal flaws before you launch', href: '/startup-intelligence/death-scanner', icon: '☠️', color: 'from-red-500/20 to-red-600/10', border: 'border-red-500/30', badge: 'Pro' },
  { title: 'Market Gap Scanner', description: 'Reveal unmet customer needs you can own', href: '/opportunity-hub/market-gap-scanner', icon: '🔍', color: 'from-teal-500/20 to-teal-600/10', border: 'border-teal-500/30', badge: 'Pro' },
]

const sections = [
  { title: 'Startup Intelligence', desc: 'Judge, roast, scan and predict your startup', href: '/startup-intelligence', icon: '🚀', count: 7 },
  { title: 'Founder Intelligence', desc: 'DNA, score, weakness and leadership analysis', href: '/founder-intelligence', icon: '🧬', count: 7 },
  { title: 'Opportunity Hub', desc: 'Find gaps, trends, niches and income paths', href: '/opportunity-hub', icon: '💡', count: 7 },
  { title: 'Social Intelligence', desc: 'Analyze Instagram, YouTube, X, LinkedIn, Telegram', href: '/social-intelligence', icon: '📱', count: 10 },
  { title: 'Board Room', desc: 'Product, Growth, Finance and Legal advisors', href: '/board-room', icon: '💼', count: 4 },
  { title: 'Simulators', desc: 'Customer, Investor, Shark Tank, Co-Founder', href: '/simulators', icon: '🎭', count: 4 },
]

export default function HomePage() {
  const { user, initialized } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (initialized && !user) {
      router.push('/auth/login')
    }
  }, [initialized, user, router])

  if (!user) {
    return null
  }

  const stats = [
    { label: 'Credits Left', value: user.credits, sub: 'Available this month', color: 'text-blue-400' },
    { label: 'XP Points', value: user.xp.toLocaleString(), sub: 'Experience earned', color: 'text-purple-400' },
    { label: 'Level', value: user.level, sub: 'Founder rank', color: 'text-green-400' },
    { label: 'Plan', value: (user.plan || 'FREE').toUpperCase(), sub: 'Current plan', color: 'text-orange-400' },
  ]

  return (
    <div className="space-y-10">
      {/* Hero Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Welcome back</p>
          <h1 className="text-4xl font-semibold text-white">
            Hey, {user.name}! 👋
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-300">
            Your AI operating system is ready. Run analyses, simulate conversations, and get expert advice — all in one place.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
              <p className={`mt-2 text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
              <p className="mt-1 text-xs text-slate-400">{stat.sub}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Quick Actions</h2>
            <p className="mt-1 text-sm text-slate-400">Jump into any tool instantly</p>
          </div>
          <Link href="/dashboard" className="text-sm font-medium text-blue-400 hover:text-blue-300">
            View all →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <Link href={action.href as any}>
                <div className={`group h-full rounded-2xl border ${action.border} bg-gradient-to-br ${action.color} p-5 transition hover:-translate-y-1 hover:shadow-lg cursor-pointer`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{action.icon}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      action.badge === 'Free'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {action.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">{action.title}</h3>
                  <p className="text-xs text-slate-400 leading-5">{action.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <Link key={section.href} href={section.href as any}>
            <div className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/[0.08] hover:-translate-y-1 cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{section.icon}</span>
                <span className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded-full">{section.count} tools</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{section.title}</h3>
              <p className="text-xs text-slate-400 leading-5">{section.desc}</p>
              <p className="mt-3 text-xs font-medium text-blue-400 group-hover:text-blue-300">Explore →</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Founder Hub CTA */}
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-purple-400">Founder Hub</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Level {user.level} — {user.xp.toLocaleString()} XP</h3>
            <p className="mt-2 text-sm text-slate-300">Complete challenges, earn achievements, and level up your founder journey.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/founder-hub/challenges" className="rounded-xl bg-purple-500/20 border border-purple-500/30 px-4 py-2 text-sm font-medium text-purple-300 hover:bg-purple-500/30 transition">
              Daily Challenges
            </Link>
            <Link href="/founder-hub" className="rounded-xl bg-white/10 border border-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15 transition">
              View Hub
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}