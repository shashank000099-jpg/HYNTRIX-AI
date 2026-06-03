'use client';

import Link from 'next/link';
import Card from '../../components/ui/Card';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Settings</p>
        <h1 className="text-4xl font-semibold text-white">Profile settings are in your profile</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">
          All account preferences, billing, notifications, security and appearance settings live in the profile workspace.
          Developer configuration and secret credentials are intentionally hidden from the founder experience.
        </p>
      </div>
      <Card className="rounded-[2rem] border-white/10 p-8 text-slate-300">
        <p>
          Use the <Link href="/profile" className="text-primary hover:text-secondary">Profile</Link> page to manage your personal profile, plan, credits, reports and app appearance.
        </p>
      </Card>
    </div>
  );
}
