'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { simulatorFeatures } from '../../lib/features';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function SimulatorsPage() {
  const router = useRouter();

  const handleStartSimulator = (key: string) => {
    router.push(`/simulators/${key}`);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Simulators</p>
        <h1 className="text-4xl font-semibold text-white">Interactive customer simulations</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">Simulate conversations with buyer personas, then download the transcript for preparation and narrative review.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {simulatorFeatures.map((feature) => (
          <Card key={feature.key} className="group transition hover:-translate-y-1">
            <div className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{feature.title}</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{feature.description}</h2>
              </div>
              <div className="flex items-center justify-between">
                <Link href={`/simulators/${feature.key}` as any} className="text-sm font-semibold text-primary hover:text-secondary">Open simulator</Link>
                <Button variant="ghost" onClick={() => handleStartSimulator(feature.key)}>Start</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
