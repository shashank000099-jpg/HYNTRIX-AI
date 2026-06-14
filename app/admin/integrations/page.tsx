'use client';

import Card from '../../../components/ui/Card';

export default function AdminIntegrationsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Admin integrations</p>
        <h1 className="text-4xl font-semibold text-white">Backend connector overview</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">This hidden admin page surfaces integration health and backend connectivity in a secure context.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {['Supabase', 'Gemini', 'OpenAI', 'Razorpay', 'YouTube', 'Apify'].map((integration) => (
          <Card key={integration} className="space-y-4">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{integration}</p>
            <h2 className="text-2xl font-semibold text-white">Status: Active</h2>
            <p className="text-sm leading-7 text-slate-300">No public configuration is exposed to standard users.</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
