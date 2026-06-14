// ============================================
// FUTURE PAYMENT SERVICE LAYER
// ============================================
// Prepare architecture for Razorpay integration
// NOT integrated yet - only structural

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

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService()
    }
    return PaymentService.instance
  }

  async createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    // TODO: Integrate Razorpay API
    throw new Error('Payment integration coming soon. Configure Razorpay keys in settings.')
  }

  async verifyPayment(request: PaymentVerificationRequest): Promise<boolean> {
    // TODO: Verify payment signature
    throw new Error('Payment verification coming soon.')
  }

  async processRefund(paymentId: string, amount?: number): Promise<boolean> {
    // TODO: Process refund via Razorpay
    throw new Error('Refund processing coming soon.')
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