export async function createRazorpayOrder(amount: number, currency = 'INR') {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
    throw new Error('Razorpay keys are not configured. Add RAZORPAY_KEY_ID and RAZORPAY_SECRET to your environment.');
  }

  return {
    provider: 'razorpay',
    amount,
    currency,
    orderId: `order_${Date.now()}`,
    status: 'created'
  };
}
