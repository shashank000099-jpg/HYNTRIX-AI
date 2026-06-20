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
  const key_id = process.env.RAZORPAY_KEY_ID?.trim() ?? ''
  const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim() ?? ''

  console.error('[AuthAudit] RAZORPAY_KEY_ID loaded:', !!key_id, '| first10:', key_id.slice(0, 10))
  console.error('[AuthAudit] RAZORPAY_KEY_SECRET loaded:', !!key_secret, '| first10:', key_secret.slice(0, 10))
  console.error('[AuthAudit] key_id prefix:', key_id.slice(0, 7), '| expected test prefix: rzp_test')
  console.error('[AuthAudit] key_id prefix:', key_id.slice(0, 7), '| expected live prefix: rzp_live')
  console.error('[AuthAudit] key_secret length:', key_secret.length, '| expected: 32')

  if (!key_id) {
    throw new Error('Payment system is not configured. RAZORPAY_KEY_ID is missing.')
  }
  if (!key_secret) {
    throw new Error('Payment system is not configured. RAZORPAY_KEY_SECRET is missing.')
  }

  const keyType = key_id.startsWith('rzp_test') ? 'TEST' : key_id.startsWith('rzp_live') ? 'LIVE' : 'UNKNOWN'
  console.error('[AuthAudit] key_type:', keyType)

  return new Razorpay({ key_id, key_secret })
}

export async function POST(request: Request) {
  const log: string[] = []
  const logError = (msg: string) => { console.error('[CreateOrder]', msg); log.push(msg) }
  const logInfo = (msg: string) => { console.log('[CreateOrder]', msg); log.push(msg) }

  try {
    const body = await request.json()
    const { amount, credits, userId } = body

    logInfo(`request_body: amount=${amount}, credits=${credits}, userId=${userId}`)

    // Validate amount (minimum 100 paise = ₹1)
    if (!amount || amount < 100) {
      logError(`validation_failed: amount=${amount} (min 100)`)
      return NextResponse.json(
        { success: false, error: 'Minimum amount is ₹1 (100 paise)', logs: log },
        { status: 400 }
      )
    }

    if (!credits || credits < 1) {
      logError(`validation_failed: credits=${credits}`)
      return NextResponse.json(
        { success: false, error: 'Invalid credit amount', logs: log },
        { status: 400 }
      )
    }

    if (!userId) {
      logError('validation_failed: userId missing')
      return NextResponse.json(
        { success: false, error: 'User ID is required', logs: log },
        { status: 400 }
      )
    }

    // Check env vars
    const rawKeyId = process.env.RAZORPAY_KEY_ID ?? ''
    const rawKeySecret = process.env.RAZORPAY_KEY_SECRET ?? ''
    const keyId = rawKeyId.trim()
    const keySecret = rawKeySecret.trim()

    console.log('KEY_ID_PREFIX:', rawKeyId.substring(0, 15))
    console.log('SECRET_PRESENT:', !!rawKeySecret)
    console.log('KEY_ID_WHITESPACE:', rawKeyId !== keyId)
    console.log('SECRET_WHITESPACE:', rawKeySecret !== keySecret)
    console.log('KEY_ID_LENGTH:', keyId.length)
    console.log('SECRET_LENGTH:', keySecret.length)

    logInfo(`env_check: RAZORPAY_KEY_ID=${keyId ? 'set' : 'MISSING'}, RAZORPAY_KEY_SECRET=${keySecret ? 'set' : 'MISSING'}`)

    if (!keyId) {
      logError('env_missing: RAZORPAY_KEY_ID')
      return NextResponse.json(
        { success: false, error: 'Payment system is not configured. RAZORPAY_KEY_ID is missing.', logs: log },
        { status: 500 }
      )
    }
    if (!keySecret) {
      logError('env_missing: RAZORPAY_KEY_SECRET')
      return NextResponse.json(
        { success: false, error: 'Payment system is not configured. RAZORPAY_KEY_SECRET is missing.', logs: log },
        { status: 500 }
      )
    }

    // Generate receipt
    let receipt = `hx_${Date.now()}`
    if (receipt.length > 40) {
      receipt = receipt.slice(0, 40)
    }
    logInfo(`receipt=${receipt}`)

    // Create Razorpay instance
    let razorpay: Razorpay
    try {
      razorpay = getRazorpayInstance()
      logInfo('razorpay_instance_created')
    } catch (initError: any) {
      logError(`razorpay_init_failed: ${initError.message}`)
      return NextResponse.json(
        { success: false, error: initError.message || 'Failed to initialize payment system.', logs: log },
        { status: 500 }
      )
    }

    // Create order via Razorpay API (this is the real auth test)
    let order: any
    try {
      order = await razorpay.orders.create({
        amount: Math.round(amount),
        currency: 'INR',
        receipt: receipt,
        notes: {
          userId,
          credits: credits.toString(),
          type: 'credit_purchase',
        },
      })
      logInfo(`razorpay_order_created: order_id=${order.id}, amount=${order.amount}, currency=${order.currency}`)
    } catch (orderError: any) {
      const errStatus = orderError.status || orderError.statusCode || 'N/A'
      const errBody = orderError.error ? JSON.stringify(orderError.error) : 'no_body'
      const errDesc = orderError.error?.description || orderError.message || 'unknown'
      const errCode = orderError.error?.code || orderError.code || 'N/A'
      console.error('[RazorpayError] status:', errStatus, 'code:', errCode, 'desc:', errDesc, 'body:', errBody.slice(0, 500))
      logError(`razorpay_order_failed: status=${errStatus}, code=${errCode}, desc=${errDesc}, body=${errBody.slice(0, 200)}`)
      if (errStatus === 401 || errStatus === 403) {
        return NextResponse.json(
          { success: false, error: `Razorpay auth failed (HTTP ${errStatus}): ${errDesc}`, logs: log },
          { status: 401 }
        )
      }
      return NextResponse.json(
        { success: false, error: `Razorpay error (HTTP ${errStatus}): ${errDesc}`, logs: log },
        { status: 500 }
      )
    }

    // Create pending payment record in database
    try {
      await createPendingTransaction(request, userId, order.id, amount, credits, order.receipt, order.notes)
      logInfo(`pending_payment_created: user=${userId}, order=${order.id}`)
    } catch (dbError: any) {
      console.error('[CreateOrder] DB ERROR FULL:', {
        message: dbError.message,
        code: dbError.code,
        details: dbError.details,
        hint: dbError.hint,
        stack: dbError.stack,
      })
      logError(`db_transaction_failed: ${dbError.message}`)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to initialize payment. Please try again.',
          dbError: {
            message: dbError.message,
            code: dbError.code,
            details: dbError.details,
            hint: dbError.hint,
          },
          logs: log,
        },
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
      logs: log,
    })
  } catch (error: any) {
    logError(`unhandled: ${error.message}`)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order', logs: log },
      { status: 500 }
    )
  }
}
