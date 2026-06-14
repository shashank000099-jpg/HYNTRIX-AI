'use client';

import Card from '../../../components/ui/Card';

export default function AdminSystemPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Admin system</p>
        <h1 className="text-4xl font-semibold text-white">Platform configuration</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">Manage hidden deployment and environment settings from an access-controlled admin surface.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Deployment</h2>
          <p className="text-sm leading-7 text-slate-300">Ready for Vercel with private environment variables.</p>
        </Card>
        <Card className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Runtime</h2>
          <p className="text-sm leading-7 text-slate-300">Monitor server processes and integrations in secure admin mode.</p>
        </Card>
      </div>
    </div>
  );
}
