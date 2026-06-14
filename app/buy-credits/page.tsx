'use client'

import { motion } from 'framer-motion'
import { useAuthStore } from '../../lib/auth-store'
import { useCreditsStore } from '../../lib/credits-store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { CREDIT_PACKS } from '../../lib/credits'
import { Zap, ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'

export default function BuyCreditsPage() {
  const { user, initialized } = useAuthStore()
  const { balance: credits, used, fetchBalance } = useCreditsStore()
  const router = useRouter()

  useEffect(() => {
    if (initialized && !user) {
      router.push('/auth/login')
      return
    }
    if (user?.id) {
      fetchBalance(user.id)
    }
  }, [user, initialized, router, fetchBalance])

  if (!initialized || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div>
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        <h1 className="text-4xl font-semibold text-white">Buy Credits</h1>
        <p className="mt-2 text-slate-400">Purchase credits to use Hyntrix AI Premium Intelligence</p>
      </div>

      {/* Current Balance */}
      <div className="rounded-2xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-500/10">
              <Zap className="h-7 w-7 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-yellow-400">Current Balance</p>
              <p className="text-3xl font-bold text-white">{credits} Credits</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">Used</p>
            <p className="text-lg font-semibold text-slate-300">{used} credits</p>
          </div>
        </div>
      </div>

      {/* Credit Packs */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Choose a Pack</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {CREDIT_PACKS.map((pack, index) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              {'popular' in pack && pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <div className={`rounded-2xl border ${'popular' in pack && pack.popular ? 'border-blue-500/40 bg-blue-500/5' : 'border-white/10 bg-white/5'} p-6 h-full flex flex-col`}>
                <div className="mb-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{pack.label}</p>
                  <p className="text-4xl font-bold text-white mt-2">{pack.credits}</p>
                  <p className="text-sm text-slate-400">Credits</p>
                </div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold text-white">{pack.priceLabel}</span>
                  {pack.credits > 20 && (
                    <span className="text-sm text-slate-500">
                      (₹{(pack.price / pack.credits).toFixed(1)}/credit)
                    </span>
                  )}
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  <li className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="h-4 w-4 text-green-400 flex-shrink-0" /> {pack.credits} credits for AI analysis
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="h-4 w-4 text-green-400 flex-shrink-0" /> No expiry
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="h-4 w-4 text-green-400 flex-shrink-0" /> Use on any feature
                  </li>
                </ul>
                <button className={`w-full py-3 rounded-xl font-semibold text-sm transition ${
                  'popular' in pack && pack.popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'border border-white/20 text-white hover:bg-white/5'
                }`}>
                  Buy {pack.credits} Credits
                </button>
                <p className="text-center text-xs text-slate-500 mt-2">Secure payment via Razorpay</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">How credits work</h3>
        <div className="space-y-3 text-sm text-slate-400">
          <p>• Every AI analysis costs 20 credits</p>
          <p>• Credits never expire</p>
          <p>• Purchase credits anytime — no subscription required</p>
          <p>• Instant delivery to your account</p>
        </div>
      </div>
    </div>
  )
}