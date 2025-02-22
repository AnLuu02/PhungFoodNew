import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {});

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { amount } = data;

    if (amount < 20000) {
      return NextResponse.json({ error: 'Số tiền thanh toán tối thiểu là 20,000 VND' }, { status: 400 });
    }

    // Tạo PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Số tiền thanh toán (ví dụ: 20,000 VND)
      currency: 'vnd', // Đơn vị tiền tệ
      automatic_payment_methods: {
        enabled: true
      }
    });

    // Trả về clientSecret cho frontend
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id // Trả về ID của PaymentIntent
    });
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    return NextResponse.json({ error: 'Failed to create PaymentIntent' }, { status: 500 });
  }
}
