'use client'

import Link from 'next/link'
import { simulatorFeatures } from '../../lib/features'
import Card from '../../components/ui/Card'
import BackButton from '../../components/ui/BackButton'

export default function SimulatorsPage() {
  return (
    <div className="space-y-8">
      <BackButton href="/" label="Home" />

      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Simulators</p>
        <h1 className="text-4xl font-semibold text-white">Practice real conversations</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">Simulate high-stakes conversations with customers, investors, sharks, and potential co-founders. Get real-time feedback.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {simulatorFeatures.map((feature) => (
          <Card key={feature.key} className="group transition hover:-translate-y-1">
            <div className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{feature.title}</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{feature.description}</h2>
              </div>
              <div className="flex items-center justify-between">
                <Link href={`/simulators/${feature.key}` as any} className="text-sm font-semibold text-blue-400 hover:text-blue-300">Launch Simulator</Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}