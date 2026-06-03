'use client';

import { useState } from 'react';
import Button from '../../components/ui/Button';
import ReportCard from '../../components/ReportCard';

const reports = [
  { title: 'Revenue Opportunity Review', subtitle: 'Startup Judge report for a SaaS MVP', badge: 'Startup Intelligence', footer: 'Generated 2 days ago • Score 82', type: 'plan' },
  { title: 'Founder Readiness Audit', subtitle: 'Founder DNA and roadmap summary', badge: 'Founder Intelligence', footer: 'Generated 5 days ago • Score 76', type: 'audit' },
  { title: 'Social Brand Score', subtitle: 'Instagram and X profile analysis', badge: 'Social Intelligence', footer: 'Generated 8 days ago • Score 88', type: 'audit' }
];

export default function HistoryPage() {
  const [query, setQuery] = useState('');
  const filtered = reports.filter((report) => report.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_auto] lg:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Report history</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Search, filter and manage previous insights</h1>
        </div>
        <div className="min-w-[260px]">
          <label className="mb-2 block text-sm font-medium text-slate-300">Search by title</label>
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none" placeholder="Search reports" />
        </div>
      </div>
      <div className="grid gap-6">
        {filtered.map((report) => (
          <ReportCard
            key={report.title}
            title={report.title}
            badge={report.badge}
            subtitle={report.subtitle}
            footer={report.footer}
            actions={(
              <>
                <Button variant="ghost">Open</Button>
                <Button variant="secondary">Download</Button>
                <Button variant="danger">Delete</Button>
              </>
            )}
          />
        ))}
      </div>
    </div>
  );
}
