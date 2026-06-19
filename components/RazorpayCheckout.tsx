'use client'

import { useState, useCallback } from 'react'

interface RazorpayCheckoutProps {
  amount: number // in paise
  credits: number
  userId: string
  onSuccess: (paymentId: string, orderId: string, creditsAdded: number) => void
  onError: (error: string) => void
  buttonText?: string
  disabled?: boolean
}

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

  const loadRazorpayScript = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => {
        console.warn('[RazorpayCheckout] Failed to load Razorpay script from CDN, retrying...')
        // Retry once
        const retryScript = document.createElement('script')
        retryScript.src = 'https://checkout.razorpay.com/v1/checkout.js'
        retryScript.async = true
        retryScript.onload = () => resolve()
        retryScript.onerror = () => resolve() // Continue even if script fails
        document.body.appendChild(retryScript)
      }
      document.body.appendChild(script)
    })
  }, [])

  const handlePayment = useCallback(async () => {
    setLoading(true)

    try {
      // Load Razorpay script if not already loaded
      await loadRazorpayScript()

      // Verify Razorpay is available
      if (typeof window.Razorpay === 'undefined') {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection and try again.')
      }

      // Create order via backend API
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

      // Validate key is available
      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      if (!keyId) {
        throw new Error('Payment system is not configured. Please contact support.')
      }

      // Razorpay checkout options
      const options: RazorpayOptions = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Hyntrix AI',
        description: `Purchase ${credits} Credits`,
        order_id: order.id,
        handler: async (response: RazorpayPaymentResponse) => {
          try {
            // Verify payment signature via backend
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
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Payment verification failed'
            onError(message)
          } finally {
            setLoading(false)
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

      // Handle payment failure event
      razorpay.on('payment.failed', (response: RazorpayErrorResponse) => {
        setLoading(false)
        const errorDescription = response.error?.description || 'Payment failed'
        onError(errorDescription)
      })
    } catch (err: unknown) {
      setLoading(false)
      const message = err instanceof Error ? err.message : 'Payment initialization failed'
      onError(message)
    }
  }, [amount, credits, userId, onSuccess, onError, loadRazorpayScript])

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