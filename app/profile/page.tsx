'use client';

import { useState } from 'react';
import Link from 'next/link';
import Card from '../../components/ui/Card';
import { mockUser } from '../../lib/mock-data';

const tabs = ['Profile', 'Account', 'Billing', 'Notifications', 'Security', 'Appearance'] as const;

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Profile');

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Profile</p>
        <h1 className="text-4xl font-semibold text-white">Your Founder Workspace</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">Personalize your account, billing, notifications, security and appearance in one premium workspace.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/5 p-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeTab === tab ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tab Content */}
        <Card className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{activeTab}</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{activeTab} Settings</h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-slate-300">
            {activeTab === 'Profile' && (
              <>
                <p>View your founder profile, display name, email and plan details.</p>
                <p>Upload a profile image and keep your identity consistent across reports.</p>
                <div className="space-y-3 mt-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Display Name</label>
                    <input defaultValue={mockUser.name || ''} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-blue-500/50" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Email</label>
                    <input defaultValue={mockUser.email} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-blue-500/50" disabled />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Goal</label>
                    <input defaultValue={mockUser.goal || ''} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-blue-500/50" />
                  </div>
                </div>
              </>
            )}
            {activeTab === 'Account' && (
              <>
                <p>Manage your personal details, business name and membership tier.</p>
                <p>Account editing is fully contained within your secure user profile.</p>
                <div className="mt-4 rounded-xl bg-white/5 p-4 space-y-2">
                  <p className="text-white font-medium">Plan: <span className="text-blue-400 capitalize">{mockUser.plan}</span></p>
                  <p className="text-white font-medium">Member since: <span className="text-slate-300">{new Date(mockUser.created_at).toLocaleDateString()}</span></p>
                </div>
              </>
            )}
            {activeTab === 'Billing' && (
              <>
                <p>Review billing status, credits remaining, and spend history.</p>
                <p>Razorpay integration is handled behind the scenes in the backend.</p>
                <div className="mt-4 rounded-xl bg-white/5 p-4 space-y-2">
                  <p className="text-white font-medium">Credits: <span className="text-green-400">{mockUser.credits}</span></p>
                  <p className="text-white font-medium">Plan: <span className="text-blue-400 capitalize">{mockUser.plan}</span></p>
                  <Link href="/settings" className="text-xs text-blue-400 hover:text-blue-300">View pricing plans →</Link>
                </div>
              </>
            )}
            {activeTab === 'Notifications' && (
              <>
                <p>Choose whether you receive founder updates, report summaries and product alerts.</p>
                <p>All notification settings are client-friendly and subscription safe.</p>
                <div className="mt-4 space-y-3">
                  {['Report completions', 'Weekly progress summary', 'New feature announcements', 'Challenge reminders'].map((item) => (
                    <label key={item} className="flex items-center justify-between rounded-xl bg-white/5 p-3 cursor-pointer">
                      <span className="text-sm text-white">{item}</span>
                      <div className="h-5 w-9 rounded-full bg-blue-500/30 border border-blue-500/50 relative">
                        <div className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-blue-400"></div>
                      </div>
                    </label>
                  ))}
                </div>
              </>
            )}
            {activeTab === 'Security' && (
              <>
                <p>Update your password, enable secure login, and review active sessions.</p>
                <p>Two-factor authentication is available for premium workspace control.</p>
                <div className="mt-4 rounded-xl bg-white/5 p-4 space-y-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Current Password</label>
                    <input type="password" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-blue-500/50" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">New Password</label>
                    <input type="password" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-blue-500/50" placeholder="••••••••" />
                  </div>
                </div>
              </>
            )}
            {activeTab === 'Appearance' && (
              <>
                <p>Select a visual theme, accent tone and workspace density for your founder command center.</p>
                <p>Keep the interface crisp, minimal and mobile-first.</p>
                <div className="mt-4 space-y-3">
                  {['Dark Mode', 'System Default', 'Compact View', 'Animated Transitions'].map((item) => (
                    <label key={item} className="flex items-center justify-between rounded-xl bg-white/5 p-3 cursor-pointer">
                      <span className="text-sm text-white">{item}</span>
                      <div className="h-5 w-9 rounded-full bg-white/10 border border-white/20 relative">
                        {item === 'Dark Mode' && <div className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-blue-400"></div>}
                      </div>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
          <button className="rounded-xl bg-blue-500/20 border border-blue-500/30 px-4 py-2 text-sm font-medium text-blue-300 hover:bg-blue-500/30 transition">
            Save changes
          </button>
        </Card>

        {/* Account Summary */}
        <Card className="space-y-5">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Summary</p>
            <h2 className="text-2xl font-semibold text-white">Founder Account at a Glance</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Name', value: mockUser.name },
              { label: 'Email', value: mockUser.email },
              { label: 'Plan', value: mockUser.plan, color: 'text-blue-400 capitalize' },
              { label: 'Credits', value: mockUser.credits.toString(), color: 'text-green-400' },
              { label: 'Level', value: `Level ${mockUser.level}`, color: 'text-purple-400' },
              { label: 'XP', value: mockUser.xp.toLocaleString(), color: 'text-yellow-400' },
              { label: 'Reports Generated', value: '21' }
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                <span className="text-sm text-slate-400">{item.label}</span>
                <span className={`text-sm font-semibold ${item.color || 'text-white'}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}