'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuthStore } from '../lib/auth-store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const quickActions = [
  { title: 'Startup Judge', description: 'Analyze your startup for viability', href: '/startup-intelligence/startup-judge', icon: '⚖️', badge: 'Free' },
  { title: 'Founder DNA', description: 'Discover your leadership profile', href: '/founder-intelligence/founder-dna', icon: '🧬', badge: 'Free' },
  { title: 'Opportunity Finder', description: 'Spot market gaps and opportunities', href: '/opportunity-hub/opportunity-finder', icon: '💡', badge: 'Free' },
  { title: 'Startup Roast', description: 'Get honest feedback on your business', href: '/startup-intelligence/startup-roast', icon: '🔥', badge: 'Pro' },
  { title: 'Instagram Analyzer', description: 'Analyze Instagram growth', href: '/social-intelligence/instagram-analyzer', icon: '📸', badge: 'Pro' },
  { title: 'Shark Tank Simulator', description: 'Practice your pitch with AI sharks', href: '/simulators/shark-tank-simulator', icon: '🦈', badge: 'Pro' },
]

const sections = [
  { title: 'Startup Intelligence', desc: 'Judge, roast, scan your startup', href: '/startup-intelligence', icon: '🚀', count: 7 },
  { title: 'Founder Intelligence', desc: 'DNA, score, leadership analysis', href: '/founder-intelligence', icon: '🧬', count: 7 },
  { title: 'Opportunity Hub', desc: 'Find gaps, trends, niches', href: '/opportunity-hub', icon: '💡', count: 7 },
  { title: 'Social Intelligence', desc: 'Analyze Instagram, YouTube, X', href: '/social-intelligence', icon: '📱', count: 10 },
  { title: 'Board Room', desc: 'Expert AI advisors', href: '/board-room', icon: '💼', count: 4 },
  { title: 'Simulators', desc: 'Practice real conversations', href: '/simulators', icon: '🎭', count: 4 },
]

function LandingPage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center space-y-6 py-20">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-400">AI Operating System for Founders</p>
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
          Build Smarter.<br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Launch Faster.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed">
          Analyze your startup, simulate investor conversations, and get expert AI advice — all in one platform built for founders, creators, and businesses.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/auth/signup" className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">
            Get Started Free →
          </Link>
          <Link href="/auth/login" className="px-8 py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition">
            Login
          </Link>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Everything You Need</h2>
          <p className="mt-2 text-slate-400">40+ AI tools to launch and grow your business</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((section, i) => (
            <motion.div key={section.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Link href="/auth/signup">
                <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/[0.08] hover:-translate-y-1 cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{section.icon}</span>
                    <span className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded-full">{section.count} tools</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{section.title}</h3>
                  <p className="text-sm text-slate-400">{section.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-16 space-y-4">
        <h2 className="text-3xl font-bold text-white">Ready to Start?</h2>
        <p className="text-slate-400">Join thousands of founders building smarter</p>
        <Link href="/auth/signup" className="inline-block px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">
          Start Free →
        </Link>
      </div>
    </div>
  )
}

function DashboardHome() {
  const { user } = useAuthStore()
  if (!user) return null

  const stats = [
    { label: 'Credits', value: user.credits, color: 'text-blue-400' },
    { label: 'XP', value: user.xp.toLocaleString(), color: 'text-purple-400' },
    { label: 'Level', value: user.level, color: 'text-green-400' },
    { label: 'Plan', value: (user.plan || 'FREE').toUpperCase(), color: 'text-orange-400' },
  ]

  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Welcome back</p>
          <h1 className="text-4xl font-semibold text-white">Hey, {user.name}! 👋</h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-300">Your AI operating system is ready.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
              <p className={`mt-2 text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quickActions.map((action, index) => (
            <motion.div key={action.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Link href={action.href as any}>
                <div className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:shadow-lg cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{action.icon}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${action.badge === 'Free' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>{action.badge}</span>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">{action.title}</h3>
                  <p className="text-xs text-slate-400 leading-5">{action.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

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
    </div>
  )
}

export default function HomePage() {
  const { user, initialized } = useAuthStore()

  if (!initialized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <LandingPage />
  }

  return <DashboardHome />
}