'use client'

import { motion } from 'framer-motion'
import { useAuthStore } from '../../lib/auth-store'
import { useCreditsStore } from '../../lib/credits-store'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CREDIT_PACKS } from '../../lib/credits'
import { Zap, ArrowLeft, Check, ShoppingCart, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function BuyCreditsPage() {
  const { user, initialized } = useAuthStore()
  const { balance: credits, used, fetchBalance } = useCreditsStore()
  const router = useRouter()
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [purchaseError, setPurchaseError] = useState<string | null>(null)
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (initialized && !user) {
      router.push('/auth/login')
      return
    }
    if (user?.id) {
      fetchBalance(user.id)
    }
  }, [user, initialized, router, fetchBalance])

  const handlePurchase = async (packId: string) => {
    setPurchasing(packId)
    setPurchaseError(null)
    setPurchaseSuccess(null)

    const pack = CREDIT_PACKS.find(p => p.id === packId)
    if (!pack) {
      setPurchaseError('Invalid pack selected')
      setPurchasing(null)
      return
    }

    if (!user?.id) {
      setPurchaseError('Please login to purchase credits')
      setPurchasing(null)
      return
    }

    // Create order via API
    let orderResponse: Response
    try {
      orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: pack.price * 100, // Convert to paise
          credits: pack.credits,
          userId: user.id,
        }),
      })
    } catch {
      setPurchaseError('Network error. Please check your connection and try again.')
      setPurchasing(null)
      return
    }

    let orderData: any
    try {
      orderData = await orderResponse.json()
    } catch {
      setPurchaseError('Invalid response from payment server. Please try again.')
      setPurchasing(null)
      return
    }

    if (!orderResponse.ok || !orderData?.success || !orderData?.order) {
      setPurchaseError(orderData?.error || 'Failed to create order')
      setPurchasing(null)
      return
    }

    const { order } = orderData

    // Verify Razorpay SDK is loaded
    if (typeof window.Razorpay === 'undefined') {
      setPurchaseError('Payment system not ready. Please wait a moment and try again.')
      setPurchasing(null)
      return
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    if (!keyId) {
      setPurchaseError('Payment system is not configured. Please contact support.')
      setPurchasing(null)
      return
    }

    const options: RazorpayOptions = {
      key: keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'Hyntrix AI',
      description: `Purchase ${pack.credits} Credits`,
      order_id: order.id,
      handler: async (response: RazorpayPaymentResponse) => {
        try {
          const verifyResponse = await fetch('/api/razorpay/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user.id,
              credits: pack.credits,
            }),
          })

          const verifyData = await verifyResponse.json()

          if (verifyResponse.ok && verifyData.success) {
            setPurchaseSuccess(`Successfully purchased ${pack.credits} credits!`)
            fetchBalance(user.id)
            // Redirect to dashboard after short delay
            setTimeout(() => {
              router.push('/dashboard?payment=success')
            }, 1500)
          } else {
            setPurchaseError(verifyData.error || 'Payment verification failed')
            setPurchasing(null)
          }
        } catch {
          setPurchaseError('Payment verification failed')
          setPurchasing(null)
        }
      },
      modal: {
        ondismiss: async () => {
          // When user closes the modal, cancel the order
          try {
            await fetch('/api/razorpay/cancel-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                order_id: order.id,
                userId: user.id,
              }),
            })
          } catch {}
          setPurchasing(null)
          router.push('/dashboard?payment=cancelled')
        },
      },
      theme: {
        color: '#3B82F6',
      },
    }

    try {
      const razorpay = new window.Razorpay(options)
      razorpay.open()

      razorpay.on('payment.failed', () => {
        setPurchasing(null)
        setPurchaseError('Payment failed. Please try again.')
      })
    } catch {
      setPurchaseError('Payment failed. Please try again.')
      setPurchasing(null)
    }
  }

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

      {/* Success / Error Messages */}
      {purchaseSuccess && (
        <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-center">
          <p className="text-green-400 font-semibold">{purchaseSuccess}</p>
          <p className="text-green-400/70 text-sm mt-1">Redirecting to dashboard...</p>
        </div>
      )}
      {purchaseError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-center">
          <p className="text-red-400">{purchaseError}</p>
        </div>
      )}

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
          {CREDIT_PACKS.map((pack, index) => {
            const isPopular = 'popular' in pack && pack.popular
            return (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="px-4 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className={`rounded-2xl border ${isPopular ? 'border-blue-500/40 bg-blue-500/5' : 'border-white/10 bg-white/5'} p-6 h-full flex flex-col`}>
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
                  <button
                    onClick={() => handlePurchase(pack.id)}
                    disabled={!!purchasing}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 ${
                      purchasing
                        ? 'bg-slate-600 text-slate-300 cursor-wait'
                        : isPopular
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'border border-white/20 text-white hover:bg-white/5'
                    }`}
                  >
                    {purchasing === pack.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4" />
                        Buy {pack.credits} Credits
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-slate-500 mt-2">Secure payment via Razorpay</p>
                </div>
              </motion.div>
            )
          })}
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