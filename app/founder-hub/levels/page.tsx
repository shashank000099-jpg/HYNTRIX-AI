'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Card from '../../../components/ui/Card';
import { mockUser, mockLevels } from '../../../lib/mock-data';

export default function LevelsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Levels</p>
        <h1 className="text-4xl font-semibold text-white">Your Founder Journey</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">Level up by earning XP. Each level unlocks new features and capabilities.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-slate-400">Current Level</p>
            <p className="text-3xl font-bold text-white">Level {mockUser.level}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">XP</p>
            <p className="text-3xl font-bold text-yellow-400">{mockUser.xp.toLocaleString()}</p>
          </div>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(mockUser.xp / 20000) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-400"
          />
        </div>
      </div>

      <div className="space-y-4">
        {mockLevels.map((level) => {
          const isCurrent = level.level === mockUser.level;
          const isUnlocked = level.level <= mockUser.level;
          return (
            <motion.div
              key={level.level}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: level.level * 0.05 }}
            >
              <div className={`rounded-2xl border p-5 transition ${
                isCurrent
                  ? 'border-purple-500/50 bg-purple-500/10'
                  : isUnlocked
                    ? 'border-white/10 bg-white/5'
                    : 'border-white/5 bg-white/[0.02] opacity-60'
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${level.color} text-white font-bold text-lg`}>
                      {level.level}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{level.title}</h3>
                      <p className="text-sm text-slate-400">{level.xpRequired.toLocaleString()} XP required</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCurrent && (
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">Current</span>
                    )}
                    {isUnlocked && !isCurrent && (
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">Unlocked</span>
                    )}
                    {!isUnlocked && (
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/5 text-slate-400 border border-white/10">Locked</span>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {level.unlocks.map((unlock) => (
                    <span key={unlock} className="text-xs px-2 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10">
                      {unlock}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Link href={'/founder-hub/xp' as any} className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition">
          View XP →
        </Link>
        <Link href={'/founder-hub/achievements' as any} className="rounded-xl bg-purple-500/20 border border-purple-500/30 px-4 py-2 text-sm font-medium text-purple-300 hover:bg-purple-500/30 transition">
          Achievements →
        </Link>
      </div>
    </div>
  );
}