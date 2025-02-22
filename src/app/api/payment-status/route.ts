import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get('session_id');

    if (!session_id) {
      return NextResponse.json({ error: 'Thiếu session_id' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    return NextResponse.json({
      status: session.payment_status,
      customer_email: session.customer_details?.email,
      amount_total: session.amount_total,
      currency: session.currency
    });
  } catch (error) {
    return NextResponse.json({ error: 'Không tìm thấy thông tin thanh toán' }, { status: 500 });
  }
}
