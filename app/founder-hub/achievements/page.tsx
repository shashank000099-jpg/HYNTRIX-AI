'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Card from '../../../components/ui/Card';
import { mockAchievements, mockUser } from '../../../lib/mock-data';

type Filter = 'all' | 'earned' | 'locked';

export default function AchievementsPage() {
  const [filter, setFilter] = useState<Filter>('all');

  const earned = mockAchievements.filter((a) => a.earned);
  const locked = mockAchievements.filter((a) => !a.earned);
  const filtered = filter === 'earned' ? earned : filter === 'locked' ? locked : mockAchievements;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Achievements</p>
        <h1 className="text-4xl font-semibold text-white">Your Achievement Gallery</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">Earn badges for completing milestones, running analyses, and building founder habits.</p>
      </div>

      <div className="flex gap-3">
        {(['all', 'earned', 'locked'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition capitalize ${
              filter === f ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            {f} {f === 'earned' ? `(${earned.length})` : f === 'locked' ? `(${locked.length})` : ''}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((achievement, idx) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <div className={`rounded-2xl border p-5 transition ${
              achievement.earned
                ? 'border-purple-500/30 bg-purple-500/10'
                : 'border-white/5 bg-white/[0.02] opacity-60'
            }`}>
              <div className="flex items-start justify-between">
                <span className="text-3xl">{achievement.icon}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-yellow-400">+{achievement.xpReward} XP</span>
                  {achievement.earned && (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">Earned</span>
                  )}
                  {!achievement.earned && (
                    <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-slate-400 border border-white/10">Locked</span>
                  )}
                </div>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-white">{achievement.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{achievement.description}</p>
              {achievement.earned && achievement.earnedDate && (
                <p className="mt-3 text-xs text-slate-500">Earned on {achievement.earnedDate}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-3">
        <Link href={'/founder-hub/levels' as any} className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition">
          View Levels →
        </Link>
        <Link href={'/founder-hub/challenges' as any} className="rounded-xl bg-purple-500/20 border border-purple-500/30 px-4 py-2 text-sm font-medium text-purple-300 hover:bg-purple-500/30 transition">
          Challenges →
        </Link>
      </div>
    </div>
  );
}