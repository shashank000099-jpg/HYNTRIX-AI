'use client';

import Button from './ui/Button';
import type { ReactNode } from 'react';

export default function ReportCard({ title, subtitle, badge, footer, actions }: { title: string; subtitle: string; badge: string; footer: ReactNode; actions: ReactNode; }) {
  return (
    <div className="glass-card rounded-[2rem] border-white/10 p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{badge}</p>
          <h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{subtitle}</p>
        </div>
        <div className="rounded-3xl bg-white/5 px-4 py-2 text-sm text-slate-300">LIVE</div>
      </div>
      <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">{footer}</div>
      <div className="mt-5 flex flex-wrap gap-3">{actions}</div>
    </div>
  );
}
