'use client';

import { useState } from 'react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const tabs = ['Profile', 'Account', 'Billing', 'Notifications', 'Security', 'Appearance'] as const;

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Profile');

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Profile</p>
        <h1 className="text-4xl font-semibold text-white">Your founder workspace</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">Personalize your account, billing, notifications, security and appearance in one premium workspace.</p>
      </div>

      <div className="space-y-4 rounded-[2rem] border border-white/10 bg-surface/80 p-4 shadow-soft sm:p-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-3xl px-4 py-2 text-sm font-medium transition ${activeTab === tab ? 'bg-primary text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{activeTab}</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{activeTab} settings</h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-slate-300">
            {activeTab === 'Profile' && (
              <>
                <p>View your founder profile, display name, email and plan details.</p>
                <p>Upload a profile image and keep your identity consistent across reports.</p>
              </>
            )}
            {activeTab === 'Account' && (
              <>
                <p>Manage your personal details, business name and membership tier.</p>
                <p>Account editing is fully contained within your secure user profile.</p>
              </>
            )}
            {activeTab === 'Billing' && (
              <>
                <p>Review billing status, credits remaining, and spend history.</p>
                <p>Razorpay integration is handled behind the scenes in the backend.</p>
              </>
            )}
            {activeTab === 'Notifications' && (
              <>
                <p>Choose whether you receive founder updates, report summaries and product alerts.</p>
                <p>All notification settings are client-friendly and subscription safe.</p>
              </>
            )}
            {activeTab === 'Security' && (
              <>
                <p>Update your password, enable secure login, and review active sessions.</p>
                <p>Two-factor authentication is available for premium workspace control.</p>
              </>
            )}
            {activeTab === 'Appearance' && (
              <>
                <p>Select a visual theme, accent tone and workspace density for your founder command center.</p>
                <p>Keep the interface crisp, minimal and mobile-first.</p>
              </>
            )}
          </div>
          <Button variant="secondary">Save changes</Button>
        </Card>

        <Card className="space-y-5">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Summary</p>
            <h2 className="text-2xl font-semibold text-white">Founder account at a glance</h2>
          </div>
          <div className="space-y-4 text-sm text-slate-300">
            <p><span className="font-semibold text-white">Name:</span> Alex Taylor</p>
            <p><span className="font-semibold text-white">Email:</span> founder@hyntrix.ai</p>
            <p><span className="font-semibold text-white">Plan:</span> Growth</p>
            <p><span className="font-semibold text-white">Credits:</span> 680</p>
            <p><span className="font-semibold text-white">Reports:</span> 21 generated</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
