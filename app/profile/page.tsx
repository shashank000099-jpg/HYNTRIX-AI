'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../lib/auth-store'
import { useCreditsStore } from '../../lib/credits-store'
import { supabaseClient } from '../../lib/supabase/client'
import { User, Mail, Award, Zap, Shield, Save, TrendingUp, BarChart3, Bookmark } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, refreshUser } = useAuthStore()
  const { balance, fetchBalance } = useCreditsStore()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [error, setError] = useState<string | null>(null)
  const [reportCount, setReportCount] = useState(0)
  const [historyCount, setHistoryCount] = useState(0)

  // Live credits - auto updates when credits change
  useEffect(() => {
    if (user?.id) {
      fetchBalance(user.id)
      // Fetch report counts
      supabaseClient?.from('saved_reports').select('*', { count: 'exact', head: true }).eq('user_id', user.id).then(({ count }) => { if (count) setReportCount(count) })
      supabaseClient?.from('history').select('*', { count: 'exact', head: true }).eq('user_id', user.id).then(({ count }) => { if (count) setHistoryCount(count) })
    }
  }, [user?.id, fetchBalance])

  const handleSave = async () => {
    if (!supabaseClient || !user?.id) return

    try {
      setSaving(true)
      setError(null)
      
      const { error: updateError } = await supabaseClient
        .from('users')
        .update({ name, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (updateError) {
        setError('Failed to update profile')
        return
      }

      await refreshUser()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const statCards = [
    { label: 'Credits', value: balance, icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10', link: '/buy-credits' },
    { label: 'Reports Generated', value: historyCount, icon: BarChart3, color: 'text-blue-400', bg: 'bg-blue-500/10', link: '/history' },
    { label: 'Saved Reports', value: reportCount, icon: Bookmark, color: 'text-green-400', bg: 'bg-green-500/10', link: '/saved-reports' },
    { label: 'Level', value: user?.level || 1, icon: Award, color: 'text-purple-400', bg: 'bg-purple-500/10', link: '/founder-hub' },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Profile</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Your Account</h1>
        <p className="mt-2 text-sm text-slate-400">Manage your profile and account settings.</p>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          const content = (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:bg-white/[0.06] cursor-pointer">
              <div className={`inline-flex p-2 rounded-lg ${stat.bg} ${stat.color} mb-3`}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-xs text-slate-500">{stat.label}</p>
              <p className={`text-xl font-semibold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          )
          return stat.link ? (
            <Link key={stat.label} href={stat.link as any}>{content}</Link>
          ) : content
        })}
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
            {(user?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50"
              placeholder="Your name"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Email</label>
            <div className="flex items-center gap-2 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-400">
              <Mail className="h-4 w-4" />
              {user?.email}
            </div>
          </div>

          {/* Skills */}
          {user?.skills && user.skills.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-white mb-2">Skills</label>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, i) => (
                  <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-sm font-medium text-blue-300 hover:bg-blue-500/30 transition disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Account Info */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <h3 className="text-lg font-semibold text-white mb-4">Account Details</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-slate-400">Member since</span>
            <span className="text-white">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-slate-400">User ID</span>
            <span className="text-white font-mono text-xs">{user?.id?.slice(0, 8)}...</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-400">Account Type</span>
            <span className="text-white capitalize">{user?.plan || 'Free'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}