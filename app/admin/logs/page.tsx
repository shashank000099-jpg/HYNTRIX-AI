'use client';

import Card from '../../../components/ui/Card';

export default function AdminLogsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Admin logs</p>
        <h1 className="text-4xl font-semibold text-white">Event and audit logs</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">Inspect application events, authenticated sessions and backend status without exposing data to founders.</p>
      </div>
      <div className="grid gap-6">
        <Card className="space-y-4">
          <div className="text-sm text-slate-300">Latest admin events and platform activity are collected here when connected to Supabase logging.</div>
        </Card>
      </div>
    </div>
  );
}
