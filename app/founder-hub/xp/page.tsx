'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Card from '../../../components/ui/Card'
import { useAuthStore } from '../../../lib/auth-store'

const xpActions = [
  { action: 'Run any analysis', xp: 50, icon: '📊' },
  { action: 'Save a report', xp: 10, icon: '💾' },
  { action: 'Share a report', xp: 25, icon: '🔗' },
  { action: 'Complete daily challenge', xp: 100, icon: '🎯' },
  { action: 'Complete weekly challenge', xp: 200, icon: '🏆' },
  { action: 'Maintain 7-day streak', xp: 200, icon: '🔥' },
  { action: 'Complete simulator', xp: 75, icon: '🎭' },
  { action: 'Consult board advisor', xp: 40, icon: '💼' },
]

export default function XPPage() {
  const { user } = useAuthStore()
  const nextLevelXP = ((user?.level || 1) + 1) * 1000
  const progress = user ? ((user.xp || 0) / nextLevelXP) * 100 : 0

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">XP & Points</p>
        <h1 className="text-4xl font-semibold text-white">Experience Points</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">Earn XP by completing analyses, challenges, and daily actions. Level up to unlock new features.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Current XP</p>
            <p className="mt-2 text-5xl font-bold text-yellow-400">{user?.xp?.toLocaleString() || '0'}</p>
            <p className="mt-2 text-sm text-slate-400">{nextLevelXP - (user?.xp || 0)} XP to Level {(user?.level || 1) + 1}</p>
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>Level {user?.level || 1}</span>
              <span>Level {(user?.level || 1) + 1}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-400"
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">{Math.round(progress)}% complete</p>
          </div>
        </Card>

        <Card className="space-y-4">
          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Total XP Earned</p>
          <p className="text-5xl font-bold text-white">{user?.xp?.toLocaleString() || '0'}</p>
          <p className="text-sm text-slate-400">Across all activities since joining</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">How to Earn XP</p>
          <div className="space-y-3">
            {xpActions.map((item) => (
              <div key={item.action} className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                <div className="flex items-center gap-3">
                  <span>{item.icon}</span>
                  <span className="text-sm text-white">{item.action}</span>
                </div>
                <span className="text-sm font-semibold text-yellow-400">+{item.xp} XP</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Level Progress</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
              <div>
                <p className="text-sm text-white">Current Level</p>
                <p className="text-xs text-slate-400">Founder rank</p>
              </div>
              <span className="text-sm font-semibold text-green-400">Level {user?.level || 1}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
              <div>
                <p className="text-sm text-white">XP to Next Level</p>
                <p className="text-xs text-slate-400">Experience needed</p>
              </div>
              <span className="text-sm font-semibold text-yellow-400">{nextLevelXP - (user?.xp || 0)} XP</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex gap-3">
        <Link href="/founder-hub/levels" className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition">
          View Levels →
        </Link>
        <Link href="/founder-hub/challenges" className="rounded-xl bg-yellow-500/20 border border-yellow-500/30 px-4 py-2 text-sm font-medium text-yellow-300 hover:bg-yellow-500/30 transition">
          Daily Challenges →
        </Link>
      </div>
    </div>
  )
}