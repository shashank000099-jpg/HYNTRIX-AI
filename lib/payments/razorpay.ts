import Razorpay from 'razorpay';

export async function createRazorpayOrder(amount: number, currency = 'INR') {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys are not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your environment.');
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const order = await razorpay.orders.create({
    amount: Math.round(amount),
    currency,
  });

  return {
    provider: 'razorpay',
    amount: order.amount,
    currency: order.currency,
    orderId: order.id,
    status: order.status
  };
}
