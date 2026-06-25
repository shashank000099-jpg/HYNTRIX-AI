'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Award, Crown, Medal, ShieldCheck, Sparkles, TrendingUp, Trophy, Users } from 'lucide-react'
import { PremiumBadge, RankingCard } from '../../components/ui/PremiumBadge'
import { getPerformanceTier } from '../../lib/performance-tiers'

const leaderboardTracks = [
  {
    title: 'Top Startup Ideas',
    description: 'High-scoring startup evaluations with strong demand, execution logic, and scalability.',
    icon: Trophy,
    entries: [
      { rank: 1, score: 94, title: 'AI-Powered Legal Assistant', subtitle: 'Elite startup opportunity', badge: 'May Be Reviewed' },
      { rank: 2, score: 89, title: 'EcoTrack', subtitle: 'Advanced sustainability platform', badge: 'Review Watch' },
      { rank: 3, score: 84, title: 'Campus Commerce OS', subtitle: 'Strong niche workflow', badge: 'Strong' },
    ],
  },
  {
    title: 'Top Founders',
    description: 'Founder profiles with exceptional execution potential, resilience, and leadership signals.',
    icon: Users,
    entries: [
      { rank: 1, score: 92, title: 'Sarah Chen', subtitle: 'Operator-founder profile', badge: 'Elite' },
      { rank: 2, score: 87, title: 'Aarav Mehta', subtitle: 'Product-led founder profile', badge: 'Advanced' },
      { rank: 3, score: 81, title: 'Maya Singh', subtitle: 'Growth-focused founder profile', badge: 'Strong' },
    ],
  },
  {
    title: 'Top Creators',
    description: 'Creator profiles with strong engagement quality, brand clarity, and growth potential.',
    icon: Sparkles,
    entries: [
      { rank: 1, score: 91, title: '@techcreator', subtitle: 'YouTube growth potential', badge: 'Featured Ranking' },
      { rank: 2, score: 88, title: '@designops', subtitle: 'Instagram niche authority', badge: 'Advanced' },
      { rank: 3, score: 83, title: '@buildnotes', subtitle: 'Strong creator trajectory', badge: 'Strong' },
    ],
  },
  {
    title: 'Top Influencers',
    description: 'Influence profiles with audience trust, authority, and monetization readiness.',
    icon: Crown,
    entries: [
      { rank: 1, score: 90, title: '@growthhacker', subtitle: 'Audience trust signals', badge: 'Elite' },
      { rank: 2, score: 86, title: '@founderfieldnotes', subtitle: 'High authority niche', badge: 'Advanced' },
      { rank: 3, score: 79, title: '@marketmapper', subtitle: 'Strong engagement quality', badge: 'Strong' },
    ],
  },
  {
    title: 'Rising Talent',
    description: 'Promising founders and creators showing momentum with clear improvement paths.',
    icon: TrendingUp,
    entries: [
      { rank: 1, score: 74, title: 'Nova Labs', subtitle: 'Rising startup potential', badge: 'Rising' },
      { rank: 2, score: 72, title: '@uxdaily', subtitle: 'Rising creator potential', badge: 'Rising' },
      { rank: 3, score: 69, title: 'Rohan Kapoor', subtitle: 'Rising founder profile', badge: 'Rising' },
    ],
  },
  {
    title: 'Exceptional Performers',
    description: 'Rare scores that may qualify for the highest level of recognition review.',
    icon: Medal,
    entries: [
      { rank: 1, score: 96, title: 'Frontier Health AI', subtitle: 'Exceptional startup evaluation', badge: 'May Qualify' },
      { rank: 2, score: 95, title: '@sciencebuilder', subtitle: 'Exceptional creator potential', badge: 'May Be Featured' },
      { rank: 3, score: 95, title: 'Leena Rao', subtitle: 'Exceptional founder profile', badge: 'May Be Reviewed' },
    ],
  },
]

export default function LeaderboardPage() {
  const topScore = leaderboardTracks
    .flatMap((track) => track.entries)
    .reduce((highest, entry) => Math.max(highest, entry.score), 0)
  const topTier = getPerformanceTier(topScore)

  return (
    <div className="space-y-10 pb-12">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent p-6 md:p-8"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
              <Trophy className="h-3.5 w-3.5" />
              Opportunity Leaderboard
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Competitive Rankings</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
                Track top startup ideas, founders, creators, influencers, rising talent, and exceptional performers across the HyntrixAI opportunity ecosystem.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Highest Score</p>
              <p className={`mt-2 text-3xl font-bold ${topTier.color}`}>{topScore}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Top Tier</p>
              <div className="mt-2">
                <PremiumBadge score={topScore} />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ['Rank', 'Score-based ordering by category'],
          ['Tier', 'Developing through Exceptional'],
          ['Badge', 'Recognition-oriented status'],
        ].map(([label, value], index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.45 }}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
          >
            <ShieldCheck className="h-5 w-5 text-blue-400" />
            <p className="mt-3 text-sm font-semibold text-white">{label}</p>
            <p className="mt-1 text-xs leading-6 text-slate-400">{value}</p>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {leaderboardTracks.map((track, index) => {
          const Icon = track.icon
          return (
            <motion.div
              key={track.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04, duration: 0.45 }}
              className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:p-6"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <Icon className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{track.title}</h2>
                  <p className="mt-1 text-xs leading-6 text-slate-400">{track.description}</p>
                </div>
              </div>
              <div className="space-y-3">
                {track.entries.map((entry) => (
                  <RankingCard
                    key={`${track.title}-${entry.rank}`}
                    rank={entry.rank}
                    score={entry.score}
                    title={entry.title}
                    subtitle={`${entry.subtitle} · ${getPerformanceTier(entry.score).label}`}
                    badge={entry.badge}
                  />
                ))}
              </div>
            </motion.div>
          )
        })}
      </section>

      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <Award className="mt-0.5 h-5 w-5 text-purple-400" />
            <p className="max-w-3xl text-xs leading-6 text-slate-500">
              Rankings and recognition statuses are informational and may be reviewed by the HyntrixAI Team. They do not guarantee rewards, funding, investment, prizes, partnerships, or opportunities.
            </p>
          </div>
          <Link
            href="/startup-intelligence"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Start Evaluating
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
