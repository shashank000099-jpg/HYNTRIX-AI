'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../../lib/auth-store'
import { supabaseClient } from '../../lib/supabase/client'
import { useI18n, LANGUAGES, type Language } from '../../lib/i18n'
import BackButton from '../../components/ui/BackButton'

export default function SettingsPage() {
  const router = useRouter()
  const { user, signOut } = useAuthStore()
  const { t, language, setLanguage } = useI18n()
  const [notifications, setNotifications] = useState(true)
  const [emailUpdates, setEmailUpdates] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return }
    loadSettings()
  }, [user, router])

  async function loadSettings() {
    if (!supabaseClient || !user) return
    const { data } = await supabaseClient
      .from('settings')
      .select('notifications_enabled, email_updates')
      .eq('user_id', user.id)
      .maybeSingle()
    if (data) {
      setNotifications(data.notifications_enabled ?? true)
      setEmailUpdates(data.email_updates ?? true)
    }
  }

  async function handleSave() {
    if (!supabaseClient || !user) return
    setSaving(true)
    try {
      await supabaseClient
        .from('settings')
        .upsert({
          user_id: user.id,
          notifications_enabled: notifications,
          email_updates: emailUpdates,
          language: language,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Settings save error:', err)
    }
    setSaving(false)
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/auth/login')
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <BackButton href="/" label="Home" />

      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{t('settings.title')}</p>
        <h1 className="text-4xl font-semibold text-white">{t('settings.title')}</h1>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <p className="text-green-400 text-sm">{t('settings.saved')}</p>
        </div>
      )}

      {/* Language */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{t('settings.language')}</h2>
          <p className="text-sm text-slate-400 mt-1">{t('settings.languageDesc')}</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {(Object.entries(LANGUAGES) as [Language, string][]).map(([code, name]) => (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                language === code
                  ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{t('settings.notifications')}</h2>
          <p className="text-sm text-slate-400 mt-1">{t('settings.notificationsDesc')}</p>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            className={`relative w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-blue-500' : 'bg-white/20'}`}
            onClick={() => setNotifications(!notifications)}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : ''}`} />
          </div>
          <span className="text-sm text-slate-300">{notifications ? 'On' : 'Off'}</span>
        </label>
      </div>

      {/* Email Updates */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{t('settings.emailUpdates')}</h2>
          <p className="text-sm text-slate-400 mt-1">{t('settings.emailDesc')}</p>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            className={`relative w-12 h-6 rounded-full transition-colors ${emailUpdates ? 'bg-blue-500' : 'bg-white/20'}`}
            onClick={() => setEmailUpdates(!emailUpdates)}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${emailUpdates ? 'translate-x-6' : ''}`} />
          </div>
          <span className="text-sm text-slate-300">{emailUpdates ? 'On' : 'Off'}</span>
        </label>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50"
      >
        {saving ? '...' : t('settings.save')}
      </button>

      {/* Logout */}
      <div className="border-t border-white/10 pt-6">
        <button
          onClick={handleLogout}
          className="w-full px-6 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-medium transition"
        >
          {t('nav.signOut')}
        </button>
      </div>
    </div>
  )
}