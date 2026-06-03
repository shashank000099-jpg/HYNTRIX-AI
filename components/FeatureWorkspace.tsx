'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import LoadingOverlay from './ui/LoadingOverlay';
import CircularProgress from './charts/CircularProgress';

const workspaceSchema = z.object({
  query: z.string().min(3, 'Enter a valid prompt')
});

type WorkspaceValues = z.infer<typeof workspaceSchema>;

const sampleResult = {
  overallScore: 82,
  metrics: [
    { label: 'Market Demand', value: 86 },
    { label: 'Competition', value: 72 },
    { label: 'Revenue Potential', value: 79 },
    { label: 'Risk', value: 61 }
  ],
  strengths: ['Clear positioning', 'Early traction signals', 'Strong monetization path'],
  weaknesses: ['Limited team bandwidth', 'High customer acquisition cost', 'Regulatory exposure'],
  opportunities: ['Premium segment expansion', 'Strategic partnerships', 'Recurring service add-ons'],
  threats: ['Market consolidation', 'copycat entrants', 'execution pacing']
};

export default function FeatureWorkspace({ title, description, inputLabel }: { title: string; description: string; inputLabel?: string }) {
  const [result, setResult] = useState<typeof sampleResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  const form = useForm<WorkspaceValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: { query: '' }
  });

  const onSubmit = async (data: WorkspaceValues) => {
    setLoading(true);
    setResult(null);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);
    setResult(sampleResult);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <Card className="relative overflow-hidden">
          <div className="space-y-4">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{title}</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">{description}</h1>
              <p className="mt-3 text-sm leading-7 text-slate-300">Use the AI operating system to generate fast insights, analysis, and recommendations without building the backend.</p>
            </div>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <label className="block text-sm font-medium text-slate-200">{inputLabel ?? 'Enter your business details'}</label>
              <Input placeholder="Share details for analysis" {...form.register('query')} />
              {form.formState.errors.query ? <p className="text-sm text-danger">{form.formState.errors.query.message}</p> : null}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button type="submit">Analyze</Button>
                <Button type="button" variant="secondary" onClick={() => form.reset()}>
                  Reset
                </Button>
              </div>
            </form>
          </div>
          {loading ? <LoadingOverlay label="Crafting a premium report for your feature..." /> : null}
        </Card>

        <Card>
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Report Snapshot</p>
            <div className="rounded-[2rem] bg-slate-950/50 p-6">
              <CircularProgress value={sampleResult.overallScore} />
            </div>
            <div className="space-y-3">
              {sampleResult.metrics.map((metric) => (
                <div key={metric.label} className="rounded-3xl bg-white/5 p-4">
                  <div className="text-sm text-slate-400">{metric.label}</div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
                    <div className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${metric.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {result ? (
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
                <h2 className="text-xl font-semibold text-white">AI Verdict</h2>
                <p className="mt-3 max-w-xl text-slate-300">Based on the inputs, this feature report recommends a focused strategy to move forward with confidence. The model sees strong opportunity if you sharpen execution and market signals.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {['Build', 'Pivot', 'Avoid'].map((label) => (
                    <div key={label} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-center text-sm text-slate-200">
                      {label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4 rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Strengths</p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-300">
                    {result.strengths.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Weaknesses</p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-300">
                    {result.weaknesses.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Opportunities</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {result.opportunities.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Threats</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {result.threats.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Recommendations</p>
                <ol className="mt-4 space-y-2 text-sm text-slate-300 list-decimal pl-5">
                  <li>Validate your positioning with the highest-value customer segment.</li>
                  <li>Focus on repeatable acquisition with a bottom-up conversion funnel.</li>
                  <li>Build a lean minimum lovable product before expanding to additional channels.</li>
                </ol>
              </div>
            </div>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setSaved(true)}>{saved ? 'Report Saved' : 'Save Report'}</Button>
            <Button variant="secondary" onClick={() => setShared(true)}>{shared ? 'Shared' : 'Share Report'}</Button>
            <Button variant="ghost">Download PDF</Button>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
