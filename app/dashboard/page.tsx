'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import CircularProgress from '../../components/charts/CircularProgress';

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Dashboard</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Founder OS command center</h1>
            </div>
            <Button>New analysis</Button>
          </div>
          <p className="text-sm leading-7 text-slate-300">Monitor insights, saved reports, historical analysis and integration health from one premium workspace.</p>
          <div className="grid gap-4 md:grid-cols-2">
            {['Strategy', 'Growth', 'Funding', 'Momentum'].map((metric) => (
              <div key={metric} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-slate-500">{metric}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{Math.floor(Math.random() * 40) + 60}%</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="grid gap-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Scoreboard</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Weekly momentum</h2>
            </div>
            <div className="rounded-3xl bg-white/5 px-3 py-2 text-sm text-slate-200">Updated now</div>
          </div>
          <div className="mx-auto">
            <CircularProgress value={78} />
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <motion.div whileHover={{ y: -4 }} className="glass-card rounded-[2rem] border border-white/10 p-7 shadow-soft">
          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Startup Intelligence</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Launch-ready reviews</h3>
          <p className="mt-4 text-sm leading-7 text-slate-300">Focus on startup health, risk mitigation and product-market fit with tailored intelligence.</p>
          <Link href="/startup-intelligence" className="mt-6 inline-flex rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500">Explore</Link>
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="glass-card rounded-[2rem] border border-white/10 p-7 shadow-soft">
          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Social Intelligence</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Brand signal audits</h3>
          <p className="mt-4 text-sm leading-7 text-slate-300">Benchmark your social presence on Instagram, YouTube, X, LinkedIn and Telegram.</p>
          <Link href="/social-intelligence" className="mt-6 inline-flex rounded-3xl bg-secondary px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400">Explore</Link>
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="glass-card rounded-[2rem] border border-white/10 p-7 shadow-soft">
          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Founder Hub</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Progress & gamification</h3>
          <p className="mt-4 text-sm leading-7 text-slate-300">Track XP, streaks, milestones and achievements as you build faster.</p>
          <Link href="/founder-hub" className="mt-6 inline-flex rounded-3xl bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10">Explore</Link>
        </motion.div>
      </div>
    </div>
  );
}
