'use client'

import Link from 'next/link'
import { socialFeatures } from '../../lib/features'
import { FEATURE_REGISTRY } from '../../lib/features/registry'
import Card from '../../components/ui/Card'
import BackButton from '../../components/ui/BackButton'

const platformColors: Record<string, string> = {
  instagram: 'from-pink-500/20 to-purple-600/10 border-pink-500/30',
  youtube: 'from-red-500/20 to-red-600/10 border-red-500/30',
  x: 'from-slate-500/20 to-slate-600/10 border-slate-500/30',
  linkedin: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
  telegram: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30',
  facebook: 'from-blue-600/20 to-indigo-600/10 border-blue-600/30',
}

const platformIcons: Record<string, string> = {
  instagram: '📸',
  youtube: '📹',
  x: '𝕏',
  linkedin: '💼',
  telegram: '✈️',
  facebook: '📘',
}

export default function SocialIntelligencePage() {
  // Get all social features from registry with their status
  const registrySocialFeatures = FEATURE_REGISTRY.filter(f => f.category === 'social-intelligence')

  return (
    <div className="space-y-8">
      <BackButton href="/" label="Home" />

      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Social Intelligence</p>
        <h1 className="text-4xl font-semibold text-white">Measure your online brand signals</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">Analyze profiles across Instagram, YouTube, X, Telegram and Facebook for engagement, trust and monetization readiness. LinkedIn features coming soon.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {['instagram', 'youtube', 'x', 'facebook', 'telegram'].map((platform) => (
          <div key={platform} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <span className="text-2xl">{platformIcons[platform]}</span>
            <p className="mt-2 text-sm font-medium text-white capitalize">{platform}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {registrySocialFeatures.map((feature) => {
          const platform = feature.platform || 'instagram'
          const colorClass = platformColors[platform] || platformColors.instagram
          const isComingSoon = feature.status === 'coming_soon'
          
          if (isComingSoon) {
            return (
              <Card key={feature.key} className="opacity-60 border-dashed border-white/10 bg-white/5">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <span className="text-2xl">{platformIcons[platform] || '📱'}</span>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                      Coming Soon
                    </span>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{feature.title}</p>
                    <h2 className="mt-3 text-lg font-semibold text-white">{feature.description}</h2>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">🚧 Under development</span>
                  </div>
                </div>
              </Card>
            )
          }

          return (
            <Card key={feature.key} className={`group transition hover:-translate-y-1 bg-gradient-to-br ${colorClass}`}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{platformIcons[platform] || '📱'}</span>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/10 text-slate-300 capitalize">{platform}</span>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{feature.title}</p>
                  <h2 className="mt-3 text-lg font-semibold text-white">{feature.description}</h2>
                </div>
                <div className="flex items-center justify-between">
                  <Link href={`/social-intelligence/${feature.key}` as any} className="text-sm font-semibold text-blue-400 hover:text-blue-300">Open tool</Link>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-4xl mb-4">📊</p>
        <h3 className="text-lg font-semibold text-white mb-2">No analyses yet</h3>
        <p className="text-sm text-slate-400">Run your first social media analysis to see your brand scores and growth recommendations.</p>
      </div>
    </div>
  )
}