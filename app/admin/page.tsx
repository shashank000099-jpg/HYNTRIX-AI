'use client';

import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function AdminPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Admin area</p>
        <h1 className="text-4xl font-semibold text-white">System administration</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">A hidden admin command center for platform diagnostics, audits and secure system controls.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="space-y-4">
          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Audit logs</p>
          <h2 className="text-2xl font-semibold text-white">User activity</h2>
          <p className="text-sm leading-7 text-slate-300">Review authenticated access patterns and admin events.</p>
          <Button variant="secondary">View logs</Button>
        </Card>
        <Card className="space-y-4">
          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Integrations</p>
          <h2 className="text-2xl font-semibold text-white">Service health</h2>
          <p className="text-sm leading-7 text-slate-300">Inspect the backend integration layer and service connectivity.</p>
          <Button variant="secondary">Open integrations</Button>
        </Card>
        <Card className="space-y-4">
          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">System</p>
          <h2 className="text-2xl font-semibold text-white">Deploy controls</h2>
          <p className="text-sm leading-7 text-slate-300">Manage release info, environment status and platform settings.</p>
          <Button variant="secondary">Manage system</Button>
        </Card>
      </div>
    </div>
  );
}
