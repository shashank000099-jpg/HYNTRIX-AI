// ============================================
// RAZORPAY CREATE ORDER
// ============================================
// Creates a Razorpay order for credit purchase

import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

// DEBUG: Log environment variables on module load
console.log('[Razorpay] Module loaded')
console.log('[Razorpay] KEY_ID exists:', !!process.env.RAZORPAY_KEY_ID)
console.log('[Razorpay] KEY_SECRET exists:', !!process.env.RAZORPAY_KEY_SECRET)
console.log('[Razorpay] KEY_ID value:', process.env.RAZORPAY_KEY_ID?.substring(0, 10) + '...')
console.log('[Razorpay] KEY_SECRET length:', process.env.RAZORPAY_KEY_SECRET?.length)

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

console.log('[Razorpay] Instance created')

export async function POST(request: Request) {
  console.log('[Razorpay] POST /api/razorpay/create-order called')
  
  try {
    const body = await request.json()
    const { amount, credits, userId } = body

    console.log('[Razorpay] Request body:', { amount, credits, userId })

    // Validate amount (minimum 100 paise = ₹1)
    if (!amount || amount < 100) {
      console.error('[Razorpay] Validation failed: amount < 100')
      return NextResponse.json(
        { success: false, error: 'Minimum amount is ₹1 (100 paise)' },
        { status: 400 }
      )
    }

    if (!credits || credits < 1) {
      console.error('[Razorpay] Validation failed: invalid credits')
      return NextResponse.json(
        { success: false, error: 'Invalid credit amount' },
        { status: 400 }
      )
    }

    if (!userId) {
      console.error('[Razorpay] Validation failed: missing userId')
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      )
    }

    console.log('[Razorpay] Creating order with Razorpay API...')
    console.log('[Razorpay] Amount (paise):', Math.round(amount))
    console.log('[Razorpay] Currency: INR')
    
    // Generate receipt with format: hx_${timestamp}
    let receipt = `hx_${Date.now()}`
    console.log('[Razorpay] Receipt (before validation):', receipt)
    console.log('[Razorpay] Receipt length (before validation):', receipt.length)
    
    // Ensure receipt never exceeds 40 characters
    if (receipt.length > 40) {
      receipt = receipt.slice(0, 40)
      console.log('[Razorpay] Receipt truncated to 40 chars:', receipt)
    }
    console.log('[Razorpay] Final Receipt:', receipt)
    console.log('[Razorpay] Final Receipt length:', receipt.length)

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount), // Ensure integer paise
      currency: 'INR',
      receipt: receipt,
      notes: {
        userId,
        credits: credits.toString(),
        type: 'credit_purchase',
      },
    })

    console.log('[Razorpay] Order created successfully:', order.id)
    console.log('[Razorpay] Order details:', { id: order.id, amount: order.amount, currency: order.currency })

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
    console.error('[Razorpay] ERROR in create-order:')
    console.error('[Razorpay] Error type:', error.constructor.name)
    console.error('[Razorpay] Error message:', error.message)
    console.error('[Razorpay] Error status:', error.status || error.statusCode)
    console.error('[Razorpay] Error code:', error.code)
    console.error('[Razorpay] Full error:', JSON.stringify(error, null, 2))
    
    // Handle authentication errors
    if (error.status === 401 || error.statusCode === 401) {
      console.error('[Razorpay] AUTHENTICATION FAILED - Check API keys')
      return NextResponse.json(
        { success: false, error: 'Razorpay authentication failed. Check API keys.' },
        { status: 401 }
      )
    }

    // Handle network errors
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error('[Razorpay] NETWORK ERROR - Cannot reach Razorpay API')
      return NextResponse.json(
        { success: false, error: 'Cannot reach Razorpay API. Check network connection.' },
        { status: 500 }
      )
    }

    const errorResponse = {
      success: false,
      error: error.message || 'Failed to create order',
      debug: {
        errorType: error.constructor.name,
        errorMessage: error.message,
        errorStatus: error.status || error.statusCode,
        errorCode: error.code,
        errorDescription: error.description,
        errorField: error.field,
        razorpayError: error.error,
        fullError: process.env.NODE_ENV === 'development' ? error : undefined,
      }
    }

    console.error('[Razorpay] Returning error response:', JSON.stringify(errorResponse, null, 2))

    return NextResponse.json(
      errorResponse,
      { status: 500 }
    )
  }
}
