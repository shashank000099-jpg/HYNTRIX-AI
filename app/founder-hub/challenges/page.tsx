'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { mockChallenges } from '../../../lib/mock-data';

type ChallengeTab = 'daily' | 'weekly' | 'special';

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState<ChallengeTab>('daily');

  const tabs: { key: ChallengeTab; label: string; count: number }[] = [
    { key: 'daily', label: 'Daily', count: mockChallenges.daily.length },
    { key: 'weekly', label: 'Weekly', count: mockChallenges.weekly.length },
    { key: 'special', label: 'Special', count: mockChallenges.special.length }
  ];

  const challenges = mockChallenges[activeTab];

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Challenges</p>
        <h1 className="text-4xl font-semibold text-white">Complete Challenges, Earn Rewards</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">Take on daily, weekly, and special challenges to earn bonus XP and level up faster.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.key
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        {challenges.map((challenge, idx) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <div className={`rounded-2xl border p-5 transition ${
              challenge.completed
                ? 'border-green-500/30 bg-green-500/10'
                : 'border-white/10 bg-white/5'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">{challenge.title}</h3>
                    {challenge.completed && (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">Completed</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{challenge.description}</p>
                  {'progress' in challenge && 'total' in challenge && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Progress</span>
                        <span>{challenge.progress}/{challenge.total}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-400"
                          style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm font-semibold text-yellow-400">+{challenge.xpReward} XP</span>
                  {'timeLeft' in challenge && (
                    <span className="text-xs text-slate-500">{challenge.timeLeft}</span>
                  )}
                  {!challenge.completed && (
                    <Button variant="ghost" className="text-xs">Start</Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Card */}
      <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-6">
        <div className="flex items-start gap-4">
          <span className="text-3xl">💡</span>
          <div>
            <h3 className="text-lg font-semibold text-white">Challenge Tips</h3>
            <p className="mt-2 text-sm text-slate-300">Complete challenges daily to maintain your streak. Streaks multiply your XP earnings. Special challenges offer the biggest rewards but require sustained effort over multiple days.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/founder-hub/xp" className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition">
          View XP →
        </Link>
        <Link href="/founder-hub/achievements" className="rounded-xl bg-cyan-500/20 border border-cyan-500/30 px-4 py-2 text-sm font-medium text-cyan-300 hover:bg-cyan-500/30 transition">
          Achievements →
        </Link>
      </div>
    </div>
  );
}