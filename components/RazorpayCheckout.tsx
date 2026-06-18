'use client'

import { useState } from 'react'

interface RazorpayCheckoutProps {
  amount: number // in paise
  credits: number
  userId: string
  onSuccess: (paymentId: string, orderId: string, creditsAdded: number) => void
  onError: (error: string) => void
  buttonText?: string
  disabled?: boolean
}

// Razorpay is loaded dynamically from checkout script
// eslint-disable-next-line @typescript-eslint/no-explicit-any

export default function RazorpayCheckout({
  amount,
  credits,
  userId,
  onSuccess,
  onError,
  buttonText = 'Pay Now',
  disabled = false,
}: RazorpayCheckoutProps) {
  const [loading, setLoading] = useState(false)

  const loadRazorpayScript = (): Promise<void> => {
    return new Promise((resolve) => {
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => resolve() // Continue even if script fails to load
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    setLoading(true)

    try {
      // Load Razorpay script
      await loadRazorpayScript()

      // Create order
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          credits,
          userId,
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to create payment order')
      }

      const { order } = orderData

      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Hyntrix AI',
        description: `Purchase ${credits} Credits`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId,
                credits,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyResponse.ok && verifyData.success) {
              onSuccess(response.razorpay_payment_id, response.razorpay_order_id, verifyData.creditsAdded)
            } else {
              throw new Error(verifyData.error || 'Payment verification failed')
            }
          } catch (err: any) {
            onError(err?.message || 'Payment verification failed')
          }
        },
        prefill: {
          // User details can be pre-filled here if available
        },
        notes: {
          userId,
          credits: credits.toString(),
        },
        theme: {
          color: '#3B82F6', // Blue theme matching Hyntrix AI
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

      // Handle payment failure
      razorpay.on('payment.failed', (response: any) => {
        setLoading(false)
        onError(response.error?.description || 'Payment failed')
      })
    } catch (err: any) {
      setLoading(false)
      onError(err?.message || 'Payment initialization failed')
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || loading}
      className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Processing...
        </>
      ) : (
        buttonText
      )}
    </button>
  )
}