'use client'

import Link from 'next/link'
import { founderFeatures } from '../../lib/features'
import Card from '../../components/ui/Card'
import BackButton from '../../components/ui/BackButton'

export default function FounderIntelligencePage() {
  return (
    <div className="space-y-8">
      <BackButton href="/" label="Home" />

      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Founder Intelligence</p>
        <h1 className="text-4xl font-semibold text-white">Your personal founder dashboard</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">Assess your founder profile, readiness, roadmap, and growth strengths with curated AI insights.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {founderFeatures.map((feature) => (
          <Card key={feature.key} className="group transition hover:-translate-y-1">
            <div className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{feature.title}</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{feature.description}</h2>
              </div>
              <div className="flex items-center justify-between">
                <Link href={`/founder-intelligence/${feature.key}` as any} className="text-sm font-semibold text-blue-400 hover:text-blue-300">Open tool</Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}