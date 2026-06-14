'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Card from '../../../components/ui/Card'
import { useAuthStore } from '../../../lib/auth-store'

const levels = [
  { level: 1, title: 'Idea Seeker', xpRequired: 0, unlocks: ['Startup Judge', 'Founder DNA'], color: 'from-gray-500 to-gray-400' },
  { level: 2, title: 'Concept Builder', xpRequired: 200, unlocks: ['Startup Roast', 'Opportunity Finder'], color: 'from-blue-500 to-blue-400' },
  { level: 3, title: 'Validator', xpRequired: 500, unlocks: ['Death Scanner', 'Market Gap Scanner'], color: 'from-cyan-500 to-cyan-400' },
  { level: 4, title: 'Launcher', xpRequired: 1000, unlocks: ['Competitor Scanner', 'Social Analyzers'], color: 'from-teal-500 to-teal-400' },
  { level: 5, title: 'Traction Builder', xpRequired: 2000, unlocks: ['Success Predictor', 'Customer Simulator'], color: 'from-green-500 to-green-400' },
  { level: 6, title: 'Growth Hacker', xpRequired: 3500, unlocks: ['Board Room', 'Investor Simulator'], color: 'from-lime-500 to-lime-400' },
  { level: 7, title: 'Scale Operator', xpRequired: 5000, unlocks: ['Shark Tank Simulator', 'All Features'], color: 'from-yellow-500 to-yellow-400' },
  { level: 8, title: 'Market Leader', xpRequired: 7000, unlocks: ['Priority Support', 'Custom Reports'], color: 'from-orange-500 to-orange-400' },
  { level: 9, title: 'Category Creator', xpRequired: 9500, unlocks: ['API Access', 'White Label'], color: 'from-red-500 to-red-400' },
  { level: 10, title: 'Unicorn Founder', xpRequired: 12500, unlocks: ['All Premium Features', 'Founder Badge'], color: 'from-purple-500 to-pink-400' },
  { level: 11, title: 'Industry Titan', xpRequired: 16000, unlocks: ['Exclusive Masterclasses', 'Investor Intros'], color: 'from-violet-500 to-purple-400' },
  { level: 12, title: 'Legend', xpRequired: 20000, unlocks: ['Hall of Fame', 'Lifetime Access'], color: 'from-indigo-500 to-violet-400' },
]

export default function LevelsPage() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Levels</p>
        <h1 className="text-4xl font-semibold text-white">Founder Progression</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">Level up by earning XP through analyses, challenges, and daily actions. Each level unlocks new tools and features.</p>
      </div>

      <Card className="space-y-6">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Your Level</p>
        <p className="text-5xl font-bold text-white">Level {user?.level || 1}</p>
        <p className="text-sm text-slate-400">{(user?.xp || 0).toLocaleString()} XP earned</p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {levels.map((level, index) => {
          const isUnlocked = (user?.level || 1) >= level.level
          const isCurrent = (user?.level || 1) === level.level
          return (
            <motion.div
              key={level.level}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`rounded-2xl border p-5 ${
                isCurrent
                  ? 'border-blue-500/30 bg-blue-500/10'
                  : isUnlocked
                    ? 'border-white/10 bg-white/5'
                    : 'border-white/5 bg-white/[0.02] opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500">Level {level.level}</span>
                {isCurrent && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">Current</span>}
              </div>
              <h3 className="text-lg font-semibold text-white">{level.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{level.xpRequired.toLocaleString()} XP required</p>
              <div className="mt-3 space-y-1">
                {level.unlocks.map((item) => (
                  <p key={item} className="text-xs text-slate-500">{isUnlocked ? '✓' : '🔒'} {item}</p>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      <Link href="/founder-hub" className="inline-block rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition">
        ← Back to Hub
      </Link>
    </div>
  )
}