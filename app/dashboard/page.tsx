'use client'

import { motion } from 'framer-motion'
import { useAuthStore } from '../../lib/auth-store'
import { useCreditsStore } from '../../lib/credits-store'
import { useEffect } from 'react'
import Link from 'next/link'
import { Zap, TrendingUp, Award, Crown, Target, BarChart3, ShieldCheck } from 'lucide-react'
import { PremiumBadge, RankingCard, AchievementBadge } from '../../components/ui/PremiumBadge'
import { getPerformanceTier } from '../../lib/performance-tiers'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { balance: liveCredits, fetchBalance } = useCreditsStore()

  useEffect(() => {
    if (user?.id) fetchBalance(user.id)
  }, [user?.id])

  if (!user) return null

  const stats = [
    { label: 'Credits Available', value: liveCredits, icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'AI Tools', value: 25, icon: BarChart3, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Level', value: user.level, icon: Target, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ]

  const rankings = [
    { rank: 1, score: 94, title: 'Top Startup Idea', subtitle: 'AI-Powered Legal Assistant', badge: 'Elite' },
    { rank: 2, score: 91, title: 'Top Creator', subtitle: '@techcreator', badge: 'Elite' },
    { rank: 3, score: 88, title: 'Top Founder', subtitle: 'Sarah Chen', badge: 'Advanced' },
    { rank: 4, score: 85, title: 'Rising Talent', subtitle: '@growthhacker', badge: 'Advanced' },
    { rank: 5, score: 82, title: 'Strong Performer', subtitle: 'EcoTrack', badge: 'Strong' },
  ]

  const achievements = [
    { title: 'First Analysis', icon: '🔬', description: 'Completed your first AI analysis', unlocked: true },
    { title: 'Rising Star', icon: '⭐', description: 'Achieved Rising tier or higher', unlocked: true },
    { title: 'Strong Performer', icon: '💪', description: 'Achieved Strong tier or higher', unlocked: false },
    { title: 'Elite Achiever', icon: '🏆', description: 'Achieved Elite tier', unlocked: false },
    { title: 'Exceptional', icon: '👑', description: 'Achieved Exceptional tier', unlocked: false },
    { title: 'Top Creator', icon: '🌟', description: 'Ranked in Top Creators', unlocked: false },
  ]

  const performanceOverview = [
    { label: 'Highest Score', value: '94', detail: 'Elite startup idea', icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Best Category', value: 'Startup', detail: 'Top-performing track', icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Review Status', value: 'May Qualify', detail: 'Eligible at 85+ scores', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Recognition Status', value: 'Tracking', detail: 'Rankings and badges monitored', icon: Award, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ]

  const rankingTracks = [
    { title: 'Startup Rankings', score: 94, detail: 'Top Startup Ideas and Founder Spotlight signals' },
    { title: 'Creator Rankings', score: 91, detail: 'Top Creators, Influencers, and Rising Talent' },
  ]

  return (
    <div className="space-y-10 pb-12">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Dashboard</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Your Performance Hub
          </h1>
          <p className="text-lg text-slate-400 max-w-xl">
            Track your scores, rankings, and recognition status. Every evaluation is an opportunity to get noticed.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
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

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {performanceOverview.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.06]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-xl font-bold text-white">{item.value}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</p>
                </div>
                <div className={`rounded-xl p-2 ${item.bg}`}>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recognition Ecosystem Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-purple-600/5 to-transparent p-8"
      >
        <div className="flex items-start gap-4">
          <div className="text-4xl">🏆</div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">Recognition Ecosystem</h2>
            <p className="text-slate-300 leading-relaxed">
              Exceptional evaluations may qualify for review, leaderboard rankings, spotlight opportunities, and future programs.
              High-performing founders, creators, and startup ideas may be recognized by the HyntrixAI Team.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium">
                Founder Spotlight
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                Startup Showcase
              </span>
              <span className="px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-medium">
                Creator Rankings
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
                Elite Recognition
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Ranking Tracks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="grid gap-4 md:grid-cols-2"
      >
        {rankingTracks.map((track) => {
          const tier = getPerformanceTier(track.score)
          return (
            <div key={track.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{track.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{track.detail}</p>
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-bold ${tier.color}`}>{track.score}</p>
                  <PremiumBadge score={track.score} size="sm" />
                </div>
              </div>
            </div>
          )
        })}
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
          </div>
          <Link href="/leaderboard" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            View all →
          </Link>
        </div>
        <div className="space-y-3">
          {rankings.map((item) => (
            <RankingCard
              key={item.rank}
              rank={item.rank}
              score={item.score}
              title={item.title}
              subtitle={item.subtitle}
              badge={item.badge}
            />
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <Award className="w-5 h-5 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Achievements</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {achievements.map((achievement) => (
            <AchievementBadge
              key={achievement.title}
              title={achievement.title}
              icon={achievement.icon}
              description={achievement.description}
              unlocked={achievement.unlocked}
            />
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {[
            { title: 'Startup Judge', desc: 'Analyze your startup for viability', href: '/startup-intelligence/startup-judge', icon: '⚖️' },
            { title: 'Founder DNA', desc: 'Discover your leadership profile', href: '/founder-intelligence/founder-dna', icon: '🧬' },
            { title: 'Instagram Analyzer', desc: 'Analyze Instagram growth and brand', href: '/social-intelligence/instagram-analyzer', icon: '📸' },
            { title: 'YouTube Analyzer', desc: 'Analyze YouTube channel potential', href: '/social-intelligence/youtube-analyzer', icon: '🎬' },
            { title: 'Opportunity Finder', desc: 'Spot market gaps and opportunities', href: '/opportunity-hub/opportunity-finder', icon: '💡' },
            { title: 'AI Client Finder', desc: 'Find high-value clients with AI', href: '/ai-client-finder', icon: '🎯' },
          ].map((action, index) => (
            <Link key={action.href} href={action.href as any}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.1]"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                    20 credits
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">{action.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{action.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Performance History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <h2 className="text-2xl font-bold text-white">Performance History</h2>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="space-y-4">
            {[
              { name: 'Startup Judge', score: 78, tier: 'Strong', date: '2 days ago' },
              { name: 'Instagram Analyzer', score: 85, tier: 'Advanced', date: '5 days ago' },
              { name: 'Founder DNA', score: 72, tier: 'Rising', date: '1 week ago' },
            ].map((item, idx) => {
              const tier = getPerformanceTier(item.score)
              return (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-lg">
                      {idx === 0 ? '⚖️' : idx === 1 ? '📸' : '🧬'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <PremiumBadge score={item.score} size="sm" />
                    <span className={`text-lg font-bold ${tier.color}`}>{item.score}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
