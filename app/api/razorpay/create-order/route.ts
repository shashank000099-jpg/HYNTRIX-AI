// ============================================
// RAZORPAY CREATE ORDER
// ============================================
// Creates a Razorpay order for credit purchase
// Also creates a pending payment_transaction record

import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { createPendingTransaction } from '../../../../lib/services/billing-service'

/**
 * Get or create Razorpay instance lazily
 * Prevents "key_id is mandatory" errors during build/compilation
 */
function getRazorpayInstance(): Razorpay {
  const key_id = process.env.RAZORPAY_KEY_ID?.trim()
  const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim()

  if (!key_id) {
    throw new Error('Payment system is not configured. RAZORPAY_KEY_ID is missing.')
  }
  if (!key_secret) {
    throw new Error('Payment system is not configured. RAZORPAY_KEY_SECRET is missing.')
  }

  return new Razorpay({ key_id, key_secret })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, credits, userId } = body

    // Validate amount (minimum 100 paise = ₹1)
    if (!amount || amount < 100) {
      return NextResponse.json(
        { success: false, error: 'Minimum amount is ₹1 (100 paise)' },
        { status: 400 }
      )
    }

    if (!credits || credits < 1) {
      return NextResponse.json(
        { success: false, error: 'Invalid credit amount' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Generate receipt
    let receipt = `hx_${Date.now()}`
    if (receipt.length > 40) {
      receipt = receipt.slice(0, 40)
    }

    // Create Razorpay instance and create order
    const razorpay = getRazorpayInstance()
    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency: 'INR',
      receipt: receipt,
      notes: {
        userId,
        credits: credits.toString(),
        type: 'credit_purchase',
      },
    })

    // Create pending transaction record in database
    try {
      await createPendingTransaction(request, userId, order.id, amount, credits)
    } catch (dbError) {
      // If we can't save the transaction, log the error but don't try to update order
      console.error('[CreateOrder] Failed to create pending transaction:', dbError)
      return NextResponse.json(
        { success: false, error: 'Failed to initialize payment. Please try again.' },
        { status: 500 }
      )
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
  } catch (error: any) {
    console.error('[CreateOrder] Error:', error.message)

    // Handle authentication errors
    if (error.status === 401 || error.statusCode === 401) {
      return NextResponse.json(
        { success: false, error: 'Payment system authentication failed.' },
        { status: 401 }
      )
    }

    // Handle network errors
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { success: false, error: 'Cannot reach payment gateway. Check your network.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}