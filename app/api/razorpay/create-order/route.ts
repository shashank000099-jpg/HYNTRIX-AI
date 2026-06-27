// ============================================
// RAZORPAY CREATE ORDER
// ============================================
// Creates a Razorpay order for authenticated credit purchases.

import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import Razorpay from 'razorpay'
import { createPendingTransaction } from '../../../../lib/services/billing-service'

const PAYMENT_ERROR = 'Payment could not be started right now. Please try again or contact support.'

function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status })
}

function getRazorpayInstance(): Razorpay {
  const key_id = process.env.RAZORPAY_KEY_ID?.trim() ?? ''
  const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim() ?? ''

  if (!key_id || !key_secret) {
    throw new Error('Razorpay credentials missing')
  }

  return new Razorpay({ key_id, key_secret })
}

function getSupabase(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase credentials missing')
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.headers.get('cookie')?.split(';').map((cookie) => {
          const [name, value] = cookie.trim().split('=')
          return { name, value }
        }) || []
      },
      setAll() {},
    },
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const amount = Number(body?.amount)
    const credits = Number(body?.credits)
    const userId = String(body?.userId || '')

    if (!Number.isFinite(amount) || amount < 100) {
      return jsonError('Minimum amount is ₹1.', 400)
    }

    if (!Number.isFinite(credits) || credits < 1) {
      return jsonError('Invalid credit amount.', 400)
    }

    if (!userId) {
      return jsonError('Please sign in to continue.', 401)
    }

    const supabase = getSupabase(request)
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user || session.user.id !== userId) {
      return jsonError('Please sign in to continue.', 401)
    }

    const receipt = `hx_${Date.now()}`.slice(0, 40)
    const razorpay = getRazorpayInstance()

    let order: any
    try {
      order = await razorpay.orders.create({
        amount: Math.round(amount),
        currency: 'INR',
        receipt,
        notes: {
          userId,
          credits: credits.toString(),
          type: 'credit_purchase',
        },
      })
    } catch (error) {
      console.error('[CreateOrder] Razorpay order failed:', error)
      return jsonError(PAYMENT_ERROR, 502)
    }

    try {
      await createPendingTransaction(request, userId, order.id, amount, credits, order.receipt, order.notes)
    } catch (error) {
      console.error('[CreateOrder] Pending transaction failed:', error)
      return jsonError(PAYMENT_ERROR, 500)
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
    })
  } catch (error) {
    console.error('[CreateOrder] Unhandled error:', error)
    return jsonError(PAYMENT_ERROR, 500)
  }
}
