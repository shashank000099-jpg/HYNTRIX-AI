'use client';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const progress = [
  { label: 'XP', value: 8200, detail: 'Next level in 180 XP' },
  { label: 'Streak', value: '12 days', detail: 'Daily actions completed' },
  { label: 'Badges', value: 7, detail: 'Motivation rewards earned' }
];

export default function FounderHubPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Founder Hub</p>
        <h1 className="text-4xl font-semibold text-white">Track progress, achievements and streaks</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">A gamified founder journey with XP, levels, badges, and daily opportunities for growth.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {progress.map((item) => (
          <Card key={item.label} className="space-y-4">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
            <p className="text-3xl font-semibold text-white">{item.value}</p>
            <p className="text-sm text-slate-400">{item.detail}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Daily Opportunity</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Launch a conversion experiment</h2>
            </div>
            <Button>Run now</Button>
          </div>
          <p className="text-sm leading-7 text-slate-300">Use your founder momentum to test a new landing page angle, email sequence or social campaign.</p>
        </Card>
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Achievements</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Brand Builder</h2>
            </div>
            <Button variant="secondary">View all</Button>
          </div>
          <p className="text-sm leading-7 text-slate-300">Earn badges for founder rituals, market tests, and report launches. Stay motivated by tracking daily streaks.</p>
        </Card>
      </div>
    </div>
  );
}
