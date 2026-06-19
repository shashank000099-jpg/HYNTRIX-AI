// ============================================
// RAZORPAY WEBHOOK HANDLER
// ============================================
// Handles payment.captured and payment.failed events
// Idempotent: prevents duplicate credit additions

import { NextResponse } from 'next/server'
import { 
  findTransactionByOrderId,
  markTransactionSuccess,
  markTransactionFailed,
  addCreditsForPayment,
  savePaymentEvent,
  markEventProcessed,
  verifyWebhookSignature,
} from '../../../../lib/services/billing-service'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature') || ''
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || ''

    // Parse the event
    let event: any
    try {
      event = JSON.parse(body)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const eventType = event.event
    const eventData = event.payload?.payment?.entity || event.payload?.order?.entity || {}

    // Save event for audit
    await savePaymentEvent(
      request,
      eventType,
      eventData,
      eventData.order_id,
      eventData.id
    )

    // Verify webhook signature (if secret is configured)
    if (webhookSecret) {
      const isValid = verifyWebhookSignature(body, signature, webhookSecret)
      if (!isValid) {
        console.error('[Webhook] Invalid signature for event:', eventType)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    // Handle different event types
    switch (eventType) {
      case 'payment.captured':
        await handlePaymentCaptured(request, eventData)
        break

      case 'payment.failed':
        await handlePaymentFailed(request, eventData)
        break

      default:
        console.log('[Webhook] Unhandled event type:', eventType)
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Webhook processing failed'
    console.error('[Webhook] Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

async function handlePaymentCaptured(request: Request, data: any) {
  const orderId = data.order_id
  const paymentId = data.id

  if (!orderId || !paymentId) {
    console.error('[Webhook] Missing order_id or payment_id in payment.captured')
    return
  }

  // Find the pending transaction
  const transaction = await findTransactionByOrderId(request, orderId)
  if (!transaction) {
    console.error('[Webhook] No transaction found for order:', orderId)
    return
  }

  // Check if already processed (idempotency)
  if (transaction.status === 'success') {
    console.log('[Webhook] Transaction already processed:', orderId)
    return
  }

  // Mark transaction as success
  const marked = await markTransactionSuccess(request, orderId, paymentId)
  if (!marked) {
    console.error('[Webhook] Failed to mark transaction success:', orderId)
    return
  }

  // Add credits (idempotent - checks for duplicate history)
  const creditsAdded = await addCreditsForPayment(request, transaction.user_id, transaction.credits, transaction.id)
  if (!creditsAdded) {
    console.error('[Webhook] CRITICAL: Credits not added via webhook:', { orderId, paymentId })
  }

  console.log('[Webhook] Payment captured and credits added:', { orderId, paymentId, credits: transaction.credits })
}

async function handlePaymentFailed(request: Request, data: any) {
  const orderId = data.order_id
  const errorMessage = data.error_description || data.error_reason || 'Payment failed'

  if (!orderId) {
    console.error('[Webhook] Missing order_id in payment.failed')
    return
  }

  // Find the pending transaction
  const transaction = await findTransactionByOrderId(request, orderId)
  if (!transaction) {
    console.error('[Webhook] No transaction found for failed order:', orderId)
    return
  }

  // Only update if still pending
  if (transaction.status !== 'pending') {
    console.log('[Webhook] Transaction already processed:', orderId)
    return
  }

  await markTransactionFailed(request, orderId, errorMessage)
  console.log('[Webhook] Payment failed marked:', { orderId, error: errorMessage })
}