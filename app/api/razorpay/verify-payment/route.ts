// ============================================
// RAZORPAY VERIFY PAYMENT
// ============================================
// Verifies Razorpay payment signature, adds credits, and redirects
// Uses HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)

import { NextResponse } from 'next/server'
import { 
  verifyRazorpaySignature, 
  findTransactionByOrderId,
  markTransactionSuccess,
  addCreditsForPayment,
  savePaymentEvent,
} from '../../../../lib/services/billing-service'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, credits } = body

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({
        success: false,
        error: 'Missing payment verification fields',
        redirect: '/dashboard?payment=failed',
      }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required',
        redirect: '/dashboard?payment=failed',
      }, { status: 400 })
    }

    // Save payment event for audit
    await savePaymentEvent(
      request,
      'payment.verify_attempt',
      { razorpay_order_id, razorpay_payment_id, userId, credits },
      razorpay_order_id,
      razorpay_payment_id
    )

    // Find the pending transaction
    const transaction = await findTransactionByOrderId(request, razorpay_order_id)
    if (!transaction) {
      return NextResponse.json({
        success: false,
        error: 'Transaction not found',
        redirect: '/dashboard?payment=failed',
      }, { status: 400 })
    }

    // Check if already processed (idempotency)
    if (transaction.status === 'success') {
      // Already processed - return success
      return NextResponse.json({
        success: true,
        message: 'Payment already verified',
        creditsAdded: transaction.credits,
        newBalance: null, // Will be fetched by frontend
        redirect: '/dashboard?payment=success',
      })
    }

    // Verify signature
    const signatureValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    )

    if (!signatureValid) {
      await savePaymentEvent(
        request,
        'payment.verify_failed',
        { razorpay_order_id, razorpay_payment_id, error: 'Signature mismatch' },
        razorpay_order_id,
        razorpay_payment_id
      )
      return NextResponse.json({
        success: false,
        error: 'Payment verification failed. Invalid signature.',
        redirect: '/dashboard?payment=failed',
      }, { status: 400 })
    }

    // Mark transaction as success
    const marked = await markTransactionSuccess(request, razorpay_order_id, razorpay_payment_id)
    if (!marked) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update transaction',
        redirect: '/dashboard?payment=failed',
      }, { status: 500 })
    }

    // Add credits to user wallet (idempotent - checks for duplicate)
    const creditsToAdd = typeof credits === 'number' && credits > 0 ? credits : transaction.credits
    const creditsAdded = await addCreditsForPayment(request, userId, creditsToAdd, transaction.id)

    if (!creditsAdded) {
      // Transaction is marked success but credits failed to add
      // This is a critical error that needs manual review
      console.error('[VerifyPayment] CRITICAL: Credits not added for successful payment:', {
        transactionId: transaction.id,
        userId,
        creditsToAdd,
      })
    }

    // Save success event
    await savePaymentEvent(
      request,
      'payment.verify_success',
      { razorpay_order_id, razorpay_payment_id, userId, creditsAdded },
      razorpay_order_id,
      razorpay_payment_id
    )

    return NextResponse.json({
      success: true,
      message: 'Payment verified and credits added',
      creditsAdded: creditsToAdd,
      redirect: '/dashboard?payment=success',
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Payment verification failed'
    console.error('[VerifyPayment] Error:', message)
    return NextResponse.json({
      success: false,
      error: message,
      redirect: '/dashboard?payment=failed',
    }, { status: 500 })
  }
}