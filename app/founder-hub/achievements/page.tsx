'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Card from '../../../components/ui/Card'
import { useAuthStore } from '../../../lib/auth-store'

const achievements = [
  { id: 'first-report', title: 'First Report', description: 'Generated your first AI report', icon: '📊', xpReward: 50 },
  { id: 'startup-judge', title: 'Startup Judge', description: 'Completed 5 Startup Judge analyses', icon: '⚖️', xpReward: 100 },
  { id: 'social-analyst', title: 'Social Analyst', description: 'Analyzed 3 social media profiles', icon: '📱', xpReward: 75 },
  { id: 'board-member', title: 'Board Member', description: 'Consulted all 4 board advisors', icon: '💼', xpReward: 150 },
  { id: 'streak-7', title: '7-Day Streak', description: 'Used Hyntrix AI 7 days in a row', icon: '🔥', xpReward: 200 },
  { id: 'report-saver', title: 'Report Saver', description: 'Saved 10 reports to your library', icon: '💾', xpReward: 100 },
  { id: 'simulator-pro', title: 'Simulator Pro', description: 'Completed 10 simulator sessions', icon: '🎭', xpReward: 200 },
  { id: 'streak-30', title: '30-Day Streak', description: 'Used Hyntrix AI 30 days in a row', icon: '⚡', xpReward: 500 },
  { id: 'opportunity-hunter', title: 'Opportunity Hunter', description: 'Found 5 market opportunities', icon: '🎯', xpReward: 150 },
  { id: 'shark-survivor', title: 'Shark Survivor', description: 'Survived a full Shark Tank simulation', icon: '🦈', xpReward: 300 },
  { id: 'founder-complete', title: 'Complete Founder', description: 'Completed all Founder Intelligence tools', icon: '🧬', xpReward: 400 },
  { id: 'legend', title: 'Legend', description: 'Reached Level 12', icon: '👑', xpReward: 1000 },
]

export default function AchievementsPage() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Achievements</p>
        <h1 className="text-4xl font-semibold text-white">Badges & Milestones</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">Complete actions across Hyntrix AI to earn badges and XP rewards. Track your founder journey progress.</p>
      </div>

      <Card className="space-y-4">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Your Progress</p>
        <div className="flex items-end gap-4">
          <p className="text-4xl font-bold text-white">0/{achievements.length}</p>
          <p className="text-sm text-slate-400 mb-1">Achievements earned</p>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition opacity-60"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{achievement.icon}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-slate-400">🔒 Locked</span>
            </div>
            <h3 className="text-base font-semibold text-white">{achievement.title}</h3>
            <p className="text-xs text-slate-400 mt-1">{achievement.description}</p>
            <p className="text-xs text-yellow-400 mt-2">+{achievement.xpReward} XP</p>
          </motion.div>
        ))}
      </div>

      <Link href="/founder-hub" className="inline-block rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition">
        ← Back to Hub
      </Link>
    </div>
  )
}