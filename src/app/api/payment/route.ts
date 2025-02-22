import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { api } from '~/trpc/server';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    const product = await api.Product.getOne({ query: id });
    if (!product) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'vnd',
            product_data: {
              name: product.name,
              images: [product.images[0]?.url as string]
            },
            unit_amount: product.price
          },
          quantity: 1
        }
      ],
      return_url: `${req.headers.get('referer')}/payment-result?session_id={CHECKOUT_SESSION_ID}`,
      mode: 'payment'
    });

    return NextResponse.json({ client_secret: session.client_secret });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi khi tạo thanh toán' }, { status: 500 });
  }
}
