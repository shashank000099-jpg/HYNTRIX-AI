import Razorpay from 'razorpay'
import crypto from 'crypto'

// ============================================
// PAYMENT SERVICE LAYER
// ============================================

export interface PaymentProvider {
  provider: 'razorpay' | 'stripe'
  keyId: string
  keySecret: string
}

export interface CreateOrderRequest {
  amount: number
  currency: string
  receipt: string
  notes?: Record<string, string>
}

export interface CreateOrderResponse {
  id: string
  amount: number
  currency: string
  receipt: string
  status: string
}

export interface PaymentVerificationRequest {
  orderId: string
  paymentId: string
  signature: string
}

export interface CreditPack {
  id: string
  credits: number
  price: number
  priceLabel: string
  label: string
  description: string
  popular?: boolean
}

export const CREDIT_PACKS: CreditPack[] = [
  { id: 'single', credits: 20, price: 22, priceLabel: '₹22', label: 'Quick Access', description: 'Single report purchase' },
  { id: 'starter', credits: 100, price: 99, priceLabel: '₹99', label: 'Starter Pack', description: '5 reports worth of credits' },
  { id: 'growth', credits: 250, price: 199, priceLabel: '₹199', label: 'Most Popular', description: '12+ reports worth of credits', popular: true },
  { id: 'pro', credits: 500, price: 399, priceLabel: '₹399', label: 'Pro Pack', description: '25 reports worth of credits' },
  { id: 'founder', credits: 1000, price: 699, priceLabel: '₹699', label: 'Founder Pack', description: '50 reports worth of credits' },
]

export const SINGLE_REPORT = {
  credits: 20,
  price: 22,
  priceLabel: '₹22',
  label: 'Buy Single Report'
}

export class PaymentService {
  private static instance: PaymentService
  private razorpay: Razorpay | null = null

  private constructor() {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      this.razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    }
  }

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService()
    }
    return PaymentService.instance
  }

  async createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    if (!this.razorpay) {
      throw new Error('Razorpay keys not configured.')
    }
    const order = await this.razorpay.orders.create({
      amount: Math.round(request.amount),
      currency: request.currency,
      receipt: request.receipt,
      notes: request.notes,
    })
    
    return {
      id: order.id,
      amount: typeof order.amount === 'number' ? order.amount : parseInt(order.amount as string, 10),
      currency: order.currency,
      receipt: order.receipt as string,
      status: order.status
    }
  }

  async verifyPayment(request: PaymentVerificationRequest): Promise<boolean> {
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) {
      throw new Error('Razorpay secret not configured')
    }

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${request.orderId}|${request.paymentId}`)
      .digest('hex')

    return crypto.timingSafeEqual(Buffer.from(generatedSignature), Buffer.from(request.signature))
  }

  async processRefund(paymentId: string, amount?: number): Promise<boolean> {
    if (!this.razorpay) {
      throw new Error('Razorpay keys not configured.')
    }
    
    try {
      await this.razorpay.payments.refund(paymentId, amount ? { amount: Math.round(amount) } : {})
      return true
    } catch (e) {
      console.error('Refund failed:', e)
      return false
    }
  }

  /**
   * Get the price for a specific number of credits
   */
  getPriceForCredits(credits: number): number {
    const pack = CREDIT_PACKS.find(p => p.credits === credits)
    if (pack) return pack.price
    // Calculate pro-rata based on starter pack
    return Math.round((credits / 100) * 99)
  }

  /**
   * Calculate credits for a given amount
   */
  getCreditsForPrice(price: number): number {
    // Find the best matching pack
    const pack = CREDIT_PACKS.slice().reverse().find(p => p.price <= price)
    if (pack) return pack.credits
    return Math.floor((price / 99) * 100)
  }
}

export const paymentService = PaymentService.getInstance()
