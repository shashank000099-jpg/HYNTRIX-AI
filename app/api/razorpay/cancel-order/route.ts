// ============================================
// RAZORPAY CANCEL ORDER
// ============================================
// Called when user closes the checkout modal
// Marks the pending transaction as cancelled

import { NextResponse } from 'next/server'
import { markTransactionCancelled, findTransactionByOrderId, savePaymentEvent } from '../../../../lib/services/billing-service'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { order_id, userId } = body

    if (!order_id) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Find and cancel the pending transaction
    const transaction = await findTransactionByOrderId(request, order_id)
    
    if (!transaction) {
      // Transaction might not exist if order creation failed
      return NextResponse.json({ success: true, message: 'No transaction to cancel' })
    }

    if (transaction.status !== 'pending') {
      // Already processed (success/failed) - nothing to cancel
      return NextResponse.json({ success: true, message: 'Transaction already processed' })
    }

    await markTransactionCancelled(request, order_id)

    await savePaymentEvent(
      request,
      'payment.cancelled',
      { order_id, userId, reason: 'user_closed_modal' },
      order_id
    )

    return NextResponse.json({
      success: true,
      message: 'Payment cancelled',
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to cancel order'
    console.error('[CancelOrder] Error:', message)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}