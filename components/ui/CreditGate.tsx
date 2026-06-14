'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '../../lib/auth-store'
import { checkCredits, getCreditCost, CREDIT_COSTS, CREDIT_PACKS, SINGLE_REPORT_PURCHASE } from '../../lib/credits'
import type { FeatureType } from '../../lib/credits'
import { motion } from 'framer-motion'

interface CreditGateProps {
  feature: FeatureType
  children: React.ReactNode
  onGenerate: () => void
  loading?: boolean
}

export default function CreditGate({ feature, children, onGenerate, loading }: CreditGateProps) {
  const { user } = useAuthStore()
  const [creditInfo, setCreditInfo] = useState<{ hasEnough: boolean; currentCredits: number; requiredCredits: number; shortage: number } | null>(null)
  const [checking, setChecking] = useState(true)

  const cost = getCreditCost(feature)

  useEffect(() => {
    async function fetchCredits() {
      if (!user?.id) {
        setChecking(false)
        return
      }
      try {
        const result = await checkCredits(user.id, feature)
        setCreditInfo(result)
      } catch (err) {
        console.error('Credit check failed:', err)
        setCreditInfo({ hasEnough: false, currentCredits: 0, requiredCredits: cost, shortage: cost })
      } finally {
        setChecking(false)
      }
    }
    fetchCredits()
  }, [user?.id, feature, cost])

  if (checking) {
    return (
      <div className="space-y-6">
        {children}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          Checking credits...
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-6">
        {children}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-6 text-center">
          <p className="text-yellow-400 font-medium">Sign in to use this feature</p>
          <p className="text-sm text-yellow-500/70 mt-1">This report costs {cost} credits</p>
        </motion.div>
      </div>
    )
  }

  if (!creditInfo || !creditInfo.hasEnough) {
    return (
      <div className="space-y-6">
        {children}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl">🔒</span>
          </div>
          <div>
            <p className="text-red-400 font-semibold text-lg">Not enough credits</p>
            <p className="text-slate-400 text-sm mt-1">
              {creditInfo ? `You have ${creditInfo.currentCredits} credits but need ${cost}.` : `This feature costs ${cost} credits.`}
            </p>
          </div>

          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <a href="/buy-credits" className="w-full px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition text-sm text-center">
              Buy Credits — Starting at ₹22
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto mt-4">
            {CREDIT_PACKS.slice(0, 4).map(pack => (
              <div key={pack.id} className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                <p className="text-white font-semibold text-sm">{pack.credits} Credits</p>
                <p className="text-slate-400 text-xs">{pack.priceLabel}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {children}
      <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-300">
              <span className="text-green-400 font-semibold">{creditInfo.currentCredits}</span> credits available
            </p>
            <p className="text-xs text-slate-500">This will use {cost} credits</p>
          </div>
          <button
            onClick={onGenerate}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition text-sm whitespace-nowrap"
          >
            {loading ? 'Generating...' : `Generate Report (${cost} Credits)`}
          </button>
        </div>
      </div>
    </div>
  )
}