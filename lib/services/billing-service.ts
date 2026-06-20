// ============================================
// BILLING SERVICE
// ============================================
// Server-side service for payment transactions and credit history
// Uses Supabase service role client for admin operations

import { createServerClient } from '@supabase/ssr'
import crypto from 'crypto'

interface Payment {
  id: string
  user_id: string
  order_id: string
  payment_id: string | null
  amount: number
  credits: number
  currency: string
  status: 'pending' | 'success' | 'failed' | 'cancelled' | 'refunded'
  error_message: string | null
  receipt: string | null
  notes: Record<string, any> | null
  created_at: string
  updated_at: string
}

interface CreditHistoryEntry {
  id: string
  user_id: string
  type: 'purchase' | 'usage'
  credits: number
  description: string | null
  feature_name: string | null
  transaction_id: string | null
  created_at: string
}

/**
 * Create a service Supabase client (for API routes)
 */
function createServiceClient(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase not configured')
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
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
}

// ============================================
// PAYMENT TRANSACTIONS
// ============================================

/**
 * Create a pending payment record in the payments table
 */
export async function createPendingTransaction(
  request: Request,
  userId: string,
  orderId: string,
  amount: number,
  credits: number,
  receipt?: string,
  notes?: Record<string, any>
): Promise<Payment> {
  const supabase = createServiceClient(request)

  const { data, error } = await supabase
    .from('payments')
    .insert({
      user_id: userId,
      order_id: orderId,
      payment_id: null,
      amount: amount,
      credits: credits,
      currency: 'INR',
      status: 'pending',
      receipt: receipt || null,
      notes: notes || null,
    })
    .select()
    .single()

  if (error) {
    console.error('[BillingService] Create pending payment error:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    })
    throw new Error(`Failed to create pending payment: ${error.message}`)
  }

  return data
}

/**
 * Find payment by order ID
 */
export async function findTransactionByOrderId(
  request: Request,
  orderId: string
): Promise<Payment | null> {
  const supabase = createServiceClient(request)

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('order_id', orderId)
    .maybeSingle()

  if (error) {
    console.error('[BillingService] Find payment error:', error)
    return null
  }

  return data
}

/**
 * Update payment status to success
 */
export async function markTransactionSuccess(
  request: Request,
  orderId: string,
  paymentId: string
): Promise<boolean> {
  const supabase = createServiceClient(request)

  const { error } = await supabase
    .from('payments')
    .update({
      status: 'success',
      payment_id: paymentId,
      updated_at: new Date().toISOString(),
    })
    .eq('order_id', orderId)
    .eq('status', 'pending')

  if (error) {
    console.error('[BillingService] Mark payment success error:', error)
    return false
  }

  return true
}

/**
 * Update payment status to failed
 */
export async function markTransactionFailed(
  request: Request,
  orderId: string,
  errorMessage?: string
): Promise<boolean> {
  const supabase = createServiceClient(request)

  const { error } = await supabase
    .from('payments')
    .update({
      status: 'failed',
      error_message: errorMessage || null,
      updated_at: new Date().toISOString(),
    })
    .eq('order_id', orderId)
    .eq('status', 'pending')

  if (error) {
    console.error('[BillingService] Mark payment failed error:', error)
    return false
  }

  return true
}

/**
 * Update payment status to cancelled
 */
export async function markTransactionCancelled(
  request: Request,
  orderId: string
): Promise<boolean> {
  const supabase = createServiceClient(request)

  const { error } = await supabase
    .from('payments')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('order_id', orderId)
    .eq('status', 'pending')

  if (error) {
    console.error('[BillingService] Mark payment cancelled error:', error)
    return false
  }

  return true
}

/**
 * Get payment by ID
 */
export async function getTransactionById(
  request: Request,
  transactionId: string
): Promise<Payment | null> {
  const supabase = createServiceClient(request)

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', transactionId)
    .maybeSingle()

  if (error) return null
  return data
}

// ============================================
// CREDITS
// ============================================

/**
 * Add credits to user's wallet and create credit history entry
 * Idempotent: checks if credits were already added for this payment
 */
export async function addCreditsForPayment(
  request: Request,
  userId: string,
  creditsToAdd: number,
  transactionId: string
): Promise<boolean> {
  const supabase = createServiceClient(request)

  // Check if credit history already exists for this transaction (idempotency)
  const { data: existingHistory } = await supabase
    .from('credit_history')
    .select('id')
    .eq('transaction_id', transactionId)
    .eq('type', 'purchase')
    .maybeSingle()

  if (existingHistory) {
    console.log('[BillingService] Credits already added for transaction:', transactionId)
    return true
  }

  // Get current wallet
  const { data: wallet, error: walletError } = await supabase
    .from('credits')
    .select('remaining, used')
    .eq('user_id', userId)
    .maybeSingle()

  if (walletError) {
    console.error('[BillingService] Wallet fetch error:', walletError)
    return false
  }

  const currentRemaining = wallet?.remaining ?? 0
  const currentUsed = wallet?.used ?? 0
  const newRemaining = currentRemaining + creditsToAdd

  // Update wallet
  const { error: updateError } = await supabase
    .from('credits')
    .update({
      remaining: newRemaining,
      used: currentUsed,
    })
    .eq('user_id', userId)

  if (updateError) {
    console.error('[BillingService] Credit update error:', updateError)
    return false
  }

  // Create credit history entry
  const { error: historyError } = await supabase
    .from('credit_history')
    .insert({
      user_id: userId,
      type: 'purchase',
      credits: creditsToAdd,
      description: `Purchased ${creditsToAdd} credits`,
      feature_name: null,
      transaction_id: transactionId,
    })

  if (historyError) {
    console.error('[BillingService] Credit history insert error:', historyError)
  }

  return true
}

/**
 * Deduct credits for feature usage and create credit history entry
 */
export async function deductCreditsForFeature(
  request: Request,
  userId: string,
  credits: number,
  featureName: string,
  description: string
): Promise<boolean> {
  const supabase = createServiceClient(request)

  const { data: wallet, error: walletError } = await supabase
    .from('credits')
    .select('remaining, used')
    .eq('user_id', userId)
    .maybeSingle()

  if (walletError || !wallet) {
    console.error('[BillingService] Wallet fetch error:', walletError)
    return false
  }

  if (wallet.remaining < credits) {
    console.error('[BillingService] Insufficient credits')
    return false
  }

  const newRemaining = wallet.remaining - credits
  const newUsed = (wallet.used ?? 0) + credits

  const { error: updateError } = await supabase
    .from('credits')
    .update({
      remaining: newRemaining,
      used: newUsed,
    })
    .eq('user_id', userId)

  if (updateError) {
    console.error('[BillingService] Deduct credit error:', updateError)
    return false
  }

  // Create credit history entry
  const { error: historyError } = await supabase
    .from('credit_history')
    .insert({
      user_id: userId,
      type: 'usage',
      credits: -credits,
      description: description,
      feature_name: featureName,
      transaction_id: null,
    })

  if (historyError) {
    console.error('[BillingService] Credit history insert error:', historyError)
  }

  return true
}

/**
 * Get credit balance for user
 */
export async function getCreditBalance(
  request: Request,
  userId: string
): Promise<{ remaining: number; used: number; total: number }> {
  const supabase = createServiceClient(request)

  const { data: wallet, error } = await supabase
    .from('credits')
    .select('remaining, used')
    .eq('user_id', userId)
    .maybeSingle()

  if (error || !wallet) {
    return { remaining: 0, used: 0, total: 0 }
  }

  return {
    remaining: wallet.remaining ?? 0,
    used: wallet.used ?? 0,
    total: (wallet.remaining ?? 0) + (wallet.used ?? 0),
  }
}

// ============================================
// WEBHOOK EVENTS
// ============================================

/**
 * Save a webhook event for audit
 */
export async function savePaymentEvent(
  request: Request,
  eventType: string,
  eventData: Record<string, unknown>,
  orderId?: string,
  paymentId?: string
): Promise<void> {
  const supabase = createServiceClient(request)

  try {
    await supabase.from('payment_events').insert({
      event_type: eventType,
      event_data: eventData,
      order_id: orderId || null,
      payment_id: paymentId || null,
      processed: false,
    })
  } catch (err) {
    console.error('[BillingService] Save payment event error:', err)
  }
}

/**
 * Mark payment event as processed
 */
export async function markEventProcessed(
  request: Request,
  eventId: string
): Promise<void> {
  const supabase = createServiceClient(request)

  try {
    await supabase
      .from('payment_events')
      .update({ processed: true })
      .eq('id', eventId)
  } catch (err) {
    console.error('[BillingService] Mark event processed error:', err)
  }
}

// ============================================
// SIGNATURE VERIFICATION
// ============================================

/**
 * Verify Razorpay payment signature
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keySecret) {
    console.error('[BillingService] RAZORPAY_KEY_SECRET not configured')
    return false
  }

  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')

  try {
    return crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(signature)
    )
  } catch {
    return false
  }
}

/**
 * Verify Razorpay webhook signature
 */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  webhookSecret: string
): boolean {
  const generatedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex')

  try {
    return crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(signature)
    )
  } catch {
    return false
  }
}

// ============================================
// QUERY HELPERS (for frontend use)
// ============================================

export type { Payment, CreditHistoryEntry }
