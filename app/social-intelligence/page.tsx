'use client';

import Link from 'next/link';
import { socialFeatures } from '../../lib/features';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const platformColors: Record<string, string> = {
  instagram: 'from-pink-500/20 to-purple-600/10 border-pink-500/30',
  youtube: 'from-red-500/20 to-red-600/10 border-red-500/30',
  x: 'from-slate-500/20 to-slate-600/10 border-slate-500/30',
  linkedin: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
  telegram: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30'
};

const platformIcons: Record<string, string> = {
  instagram: '📸',
  youtube: '📹',
  x: '𝕏',
  linkedin: '💼',
  telegram: '✈️'
};

export default function SocialIntelligencePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Social Intelligence</p>
        <h1 className="text-4xl font-semibold text-white">Measure your online brand signals</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">Analyze profiles across Instagram, YouTube, X, LinkedIn and Telegram for engagement, trust and monetization readiness.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {['instagram', 'youtube', 'x', 'linkedin', 'telegram'].map((platform) => (
          <div key={platform} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <span className="text-2xl">{platformIcons[platform]}</span>
            <p className="mt-2 text-sm font-medium text-white capitalize">{platform}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {socialFeatures.map((feature) => {
          const platform = feature.platform || 'instagram';
          const colorClass = platformColors[platform] || platformColors.instagram;
          return (
            <Card key={feature.key} className={`group transition hover:-translate-y-1 bg-gradient-to-br ${colorClass}`}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{platformIcons[platform] || '📱'}</span>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/10 text-slate-300 capitalize">{platform}</span>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{feature.title}</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">{feature.description}</h2>
                </div>
                <div className="flex items-center justify-between">
                  <Link href={`/social-intelligence/${feature.key}` as any} className="text-sm font-semibold text-primary hover:text-secondary">Open tool</Link>
                  <Button variant="ghost">Analyze</Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-4xl mb-4">📊</p>
        <h3 className="text-lg font-semibold text-white mb-2">No analyses yet</h3>
        <p className="text-sm text-slate-400">Run your first social media analysis to see your brand scores and growth recommendations.</p>
      </div>
    </div>
  );
}