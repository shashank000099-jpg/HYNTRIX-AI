'use client';

import Link from 'next/link';
import { opportunityFeatures } from '../../lib/features';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function OpportunityHubPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Opportunity Hub</p>
        <h1 className="text-4xl font-semibold text-white">Find market gaps and income pathways</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">Use premium opportunity workflows to identify side hustles, market gaps and income roadmaps.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {opportunityFeatures.map((feature) => (
          <Card key={feature.key} className="group transition hover:-translate-y-1">
            <div className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{feature.title}</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{feature.description}</h2>
              </div>
              <div className="flex items-center justify-between">
                <Link href={`/opportunity-hub/${feature.key}` as any} className="text-sm font-semibold text-primary hover:text-secondary">Open tool</Link>
                <Button variant="ghost">Analyze</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
