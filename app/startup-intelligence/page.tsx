'use client';

import Link from 'next/link';
import { startupFeatures } from '../../lib/features';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';

export default function StartupIntelligencePage() {
  return (
    <div className="space-y-8">
      <BackButton href="/" label="Home" />

      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Startup Intelligence</p>
        <h1 className="text-4xl font-semibold text-white">Strategic reviews for founders</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">Explore AI-powered reports for every stage of your business idea, from early validation to growth planning.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {startupFeatures.map((feature) => (
          <Card key={feature.key} className="group transition hover:-translate-y-1">
            <div className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{feature.title}</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{feature.description}</h2>
              </div>
              <div className="flex items-center justify-between">
                <Link href={`/startup-intelligence/${feature.key}` as any} className="text-sm font-semibold text-primary hover:text-secondary">Open tool</Link>
                <Button variant="ghost">Analyze</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
