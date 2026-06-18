// ============================================
// RAZORPAY VERIFY PAYMENT
// ============================================
// Verifies Razorpay payment signature and credits user

import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, credits } = body

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing payment verification fields' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      )
    }

    // Verify signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) {
      return NextResponse.json(
        { success: false, error: 'Razorpay secret not configured' },
        { status: 500 }
      )
    }

    // Generate expected signature: HMAC-SHA256(order_id + "|" + payment_id, key_secret)
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    // Compare signatures (constant-time comparison to prevent timing attacks)
    if (!crypto.timingSafeEqual(Buffer.from(generatedSignature), Buffer.from(razorpay_signature))) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Signature verified - now credit the user
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      )
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.headers.get('cookie')?.split(';').map(c => {
            const [name, value] = c.trim().split('=')
            return { name, value }
          }) || []
        },
        setAll() {},
      },
    })

    // Get current credits
    const { data: wallet, error: walletError } = await supabase
      .from('credits')
      .select('remaining, used')
      .eq('user_id', userId)
      .maybeSingle()

    if (walletError) {
      console.error('Wallet fetch error:', walletError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch user wallet' },
        { status: 500 }
      )
    }

    const currentCredits = wallet?.remaining ?? 0
    const creditsToAdd = credits || 20 // Default to 20 if not specified

    // Update credits
    const { error: updateError } = await supabase
      .from('credits')
      .update({
        remaining: currentCredits + creditsToAdd,
        used: (wallet?.used || 0),
      } as any)
      .eq('user_id', userId)

    if (updateError) {
      console.error('Credit update error:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update credits' },
        { status: 500 }
      )
    }

    // Record transaction
    try {
      await supabase.from('transactions').insert({
        user_id: userId,
        transaction_type: 'purchase',
        credits: creditsToAdd,
        balance_before: currentCredits,
        balance_after: currentCredits + creditsToAdd,
        description: `Purchased ${creditsToAdd} credits via Razorpay`,
        reference_type: 'payment',
        reference_id: razorpay_payment_id,
      } as any)
    } catch (err) {
      console.error('Transaction record error:', err)
    }

    // Log to history
    try {
      await supabase.from('history').insert({
        user_id: userId,
        action: 'Purchased credits via Razorpay',
        feature: 'payment',
        feature_type: 'payment',
        report_id: razorpay_payment_id,
        score: null,
        details: {
          creditsAdded: creditsToAdd,
          amount: null, // Could be fetched from order if needed
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
        },
      } as any)
    } catch (err) {
      console.error('History log error:', err)
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and credits added',
      creditsAdded: creditsToAdd,
      newBalance: currentCredits + creditsToAdd,
    })
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Payment verification failed' },
      { status: 500 }
    )
  }
}