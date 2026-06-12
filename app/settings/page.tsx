'use client';

import Link from 'next/link';
import Card from '../../components/ui/Card';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: '/forever',
    features: ['3 reports per month', 'Basic startup analysis', 'Founder DNA check', 'Community support'],
    current: false,
    cta: 'Current Plan',
    color: 'border-white/10 bg-white/5'
  },
  {
    name: 'Premium',
    price: '₹999',
    period: '/month',
    features: ['Unlimited reports', 'All intelligence tools', 'Simulator access', 'Priority support', 'PDF exports', 'API access'],
    current: false,
    cta: 'Upgrade to Premium',
    color: 'border-blue-500/30 bg-blue-500/10'
  },
  {
    name: 'Pro',
    price: '₹2,999',
    period: '/month',
    features: ['Everything in Premium', 'White label reports', 'Team collaboration', 'Custom integrations', 'Dedicated account manager', 'SLA guarantee'],
    current: true,
    cta: 'Current Plan',
    color: 'border-purple-500/30 bg-purple-500/10'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: ['Everything in Pro', 'Unlimited team seats', 'Custom AI models', 'On-premise deployment', '24/7 phone support', 'Custom branding'],
    current: false,
    cta: 'Contact Sales',
    color: 'border-orange-500/30 bg-orange-500/10'
  }
];

const integrations = [
  { name: 'Supabase', description: 'Database, Auth & Storage', status: 'disconnected', icon: '🗄️' },
  { name: 'Gemini AI', description: 'AI-powered analysis engine', status: 'disconnected', icon: '🤖' },
  { name: 'Razorpay', description: 'Payments & subscriptions', status: 'disconnected', icon: '💳' },
  { name: 'YouTube API', description: 'Channel analytics', status: 'disconnected', icon: '📹' },
  { name: 'Apify', description: 'Web scraping & social data', status: 'disconnected', icon: '🕷️' }
];

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Settings</p>
        <h1 className="text-4xl font-semibold text-white">Settings & Integrations</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">
          Manage your plan, integrations, and application settings. All backend integrations are configured here for Phase 2.
        </p>
      </div>

      {/* Pricing Plans */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Pricing Plans</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-2xl border p-5 ${plan.color} ${plan.current ? 'ring-2 ring-purple-500/50' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                {plan.current && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">Current</span>
                )}
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-sm text-slate-400">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-green-400">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`w-full rounded-xl px-4 py-2 text-sm font-medium transition ${
                plan.current
                  ? 'bg-white/5 text-slate-400 cursor-default'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30'
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Integrations Status */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Integration Status</h2>
        <p className="text-sm text-slate-400">All integrations are in Phase 2. Configure API keys and connect services to enable live features.</p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {integrations.map((integration) => (
            <div key={integration.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{integration.icon}</span>
                  <div>
                    <h3 className="text-base font-semibold text-white">{integration.name}</h3>
                    <p className="text-xs text-slate-400">{integration.description}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">Disconnected</span>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-slate-500">Phase 2 — Coming soon</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex gap-3">
        <Link href="/profile" className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition">
          Edit Profile →
        </Link>
        <Link href="/profile" className="rounded-xl bg-blue-500/20 border border-blue-500/30 px-4 py-2 text-sm font-medium text-blue-300 hover:bg-blue-500/30 transition">
          Account Settings →
        </Link>
      </div>
    </div>
  );
}