'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabaseClient } from '../lib/supabase/client';
import { User } from '../lib/types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: string;
  isPaid?: boolean;
}

const freeActions: QuickAction[] = [
  {
    title: 'Check Your Startup',
    description: 'Get your startup score and feedback',
    href: '/startup-intelligence',
    icon: '🚀',
    isPaid: false
  },
  {
    title: 'Founder DNA',
    description: 'Understand your founder type and strengths',
    href: '/founder-intelligence',
    icon: '🧬',
    isPaid: false
  },
  {
    title: 'Find Business Ideas',
    description: 'Get personalized business ideas',
    href: '/opportunity-hub',
    icon: '💡',
    isPaid: false
  }
];

const paidActions: QuickAction[] = [
  {
    title: 'Roast Your Startup',
    description: 'Get brutal honest feedback on your business',
    href: '/startup-intelligence',
    icon: '🔥',
    isPaid: true
  },
  {
    title: 'Check Instagram Growth',
    description: 'Analyze your Instagram performance',
    href: '/social-intelligence',
    icon: '📸',
    isPaid: true
  },
  {
    title: 'Check YouTube Growth',
    description: 'Analyze your YouTube channel',
    href: '/social-intelligence',
    icon: '📹',
    isPaid: true
  },
  {
    title: 'Board Room Advice',
    description: 'Get advice from 4 expert advisors',
    href: '/board-room',
    icon: '💼',
    isPaid: true
  },
  {
    title: 'Customer Simulator',
    description: 'See how customers will react',
    href: '/simulators',
    icon: '🎭',
    isPaid: true
  },
  {
    title: 'Shark Tank Pitch',
    description: 'Practice with investor questions',
    href: '/simulators',
    icon: '🦈',
    isPaid: true
  }
];

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!supabaseClient) return;

      try {
        const { data: { user: authUser } } = await supabaseClient.auth.getUser();
        
        if (authUser) {
          const { data: userData } = await supabaseClient
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();

          if (userData) {
            setUser(userData as User);
          }
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link href="/auth/login">
          <Button>Sign In to Continue</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user.name || 'Creator'}! 👋
          </h1>
          <p className="text-gray-400">Ready to build something amazing today?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Credits Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6">
            <div className="text-gray-500 text-sm mb-2">Credits Left</div>
            <div className="text-3xl font-bold text-white mb-1">3</div>
            <div className="text-xs text-gray-400">Free reports today</div>
          </div>

          {/* XP Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6">
            <div className="text-gray-500 text-sm mb-2">XP</div>
            <div className="text-3xl font-bold text-white mb-1">{user.xp || 0}</div>
            <div className="text-xs text-gray-400">Experience points</div>
          </div>

          {/* Level Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6">
            <div className="text-gray-500 text-sm mb-2">Level</div>
            <div className="text-3xl font-bold text-white mb-1">{user.level || 1}</div>
            <div className="text-xs text-gray-400">Keep analyzing</div>
          </div>

          {/* Plan Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6">
            <div className="text-gray-500 text-sm mb-2">Plan</div>
            <div className="text-xl font-bold text-blue-400 mb-1 capitalize">{user.plan}</div>
            <Link href="/settings" className="text-xs text-blue-400 hover:text-blue-300">
              View pricing →
            </Link>
          </div>
        </div>
      </div>

      {/* Free Features Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Free Features</h2>
          <p className="text-gray-400 text-sm mt-1">Get started with these powerful free tools</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {freeActions.map(action => (
            <Link key={action.href} href={action.href}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-lg p-6 transition cursor-pointer">
                <div className="text-4xl mb-3">{action.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{action.title}</h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <span className="text-xs text-green-400 font-medium">Free</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Paid Features Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Premium Features</h2>
          <p className="text-gray-400 text-sm mt-1">Unlock powerful paid features</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paidActions.map(action => (
            <Link key={action.href} href={user.plan === 'free' ? '/settings' : action.href}>
              <div className={`h-full rounded-2xl border backdrop-blur-lg p-6 transition cursor-pointer ${
                user.plan === 'free'
                  ? 'border-white/10 bg-white/5 hover:bg-white/10 opacity-60'
                  : 'border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20'
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="text-4xl">{action.icon}</div>
                  <div className="text-xs text-blue-400 font-medium bg-blue-500/20 px-2 py-1 rounded">
                    Premium
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{action.title}</h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
                <div className="mt-4 pt-4 border-t border-white/10">
                  {user.plan === 'free' ? (
                    <span className="text-xs text-gray-400">Upgrade to use</span>
                  ) : (
                    <span className="text-xs text-green-400 font-medium">Available</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      {user.plan === 'free' && (
        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 backdrop-blur-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Ready to unlock more?</h3>
          <p className="text-gray-400 mb-6">Get premium access to all features</p>
          <Link href="/settings">
            <Button>View Pricing Plans</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
