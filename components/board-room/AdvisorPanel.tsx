'use client';

import { useState } from 'react';
import type { FeatureDefinition } from '../../lib/types';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function AdvisorPanel({ advisor }: { advisor: FeatureDefinition }) {
  const [analysis, setAnalysis] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{advisor.title}</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">{advisor.description}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">Generate realistic investor feedback from a curated advisor persona and apply it to your strategy.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <Button onClick={() => setAnalysis('This advisor recommends focusing on customer value, simplifying the pitch deck, and staging funding around milestones.')}>Generate feedback</Button>
          <Button variant="secondary" onClick={() => setAnalysis(null)}>Reset</Button>
        </div>
      </Card>
      {analysis ? (
        <Card>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Advisor recommendation</p>
          <p className="mt-4 text-sm leading-7 text-slate-300">{analysis}</p>
        </Card>
      ) : null}
    </div>
  );
}
