'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { founderFeatures } from '../../lib/features';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function FounderIntelligencePage() {
  const router = useRouter();

  const handleAnalyze = (key: string) => {
    router.push(`/founder-intelligence/${key}`);
  };

  return (
    <div className="space-y-8">
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
                <Link href={`/founder-intelligence/${feature.key}` as any} className="text-sm font-semibold text-primary hover:text-secondary">Open tool</Link>
                <Button variant="ghost" onClick={() => handleAnalyze(feature.key)}>Analyze</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
