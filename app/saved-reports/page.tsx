'use client';

import Link from 'next/link';
import ReportCard from '../../components/ReportCard';
import Button from '../../components/ui/Button';

const savedReports = [
  { title: 'Opportunity Radar', subtitle: 'High-potential product market fit summary', badge: 'Opportunity Hub', footer: 'Saved 3 days ago • 12 pages', type: 'opportunity' },
  { title: 'Founder DNA', subtitle: 'Personalized founder strengths and roadmap', badge: 'Founder Intelligence', footer: 'Saved 1 week ago • 9 pages', type: 'founder' }
];

export default function SavedReportsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Saved reports</p>
        <h1 className="text-4xl font-semibold text-white">Your beautiful report library</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">Access polished report cards, open PDFs, and keep your most valuable analysis in one place.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        {savedReports.map((report) => (
          <ReportCard
            key={report.title}
            title={report.title}
            badge={report.badge}
            subtitle={report.subtitle}
            footer={report.footer}
            actions={(
              <>
                <Button variant="ghost">Open</Button>
                <Button>Download</Button>
              </>
            )}
          />
        ))}
      </div>
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-soft">
        <h2 className="text-2xl font-semibold text-white">Report templates & PDF exports</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">Every report supports a branded PDF layout with cover page, scores and recommendations. This workspace is ready for actual download generation.</p>
      </div>
    </div>
  );
}
