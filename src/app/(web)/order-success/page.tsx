'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string);

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent'); // Lấy payment_intent từ URL
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    if (paymentIntentId) {
      // Lấy thông tin PaymentIntent từ Stripe
      stripe.paymentIntents
        .retrieve(paymentIntentId)
        .then(paymentIntent => {
          setPaymentStatus(paymentIntent.status); // Lấy trạng thái thanh toán
        })
        .catch(error => {
          console.error('Error retrieving PaymentIntent:', error);
        });
    }
  }, [paymentIntentId]);

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100'>
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-md'>
        <h2 className='text-2xl font-bold'>Thanh toán thành công!</h2>
        <p className='mt-4 text-gray-600'>Cảm ơn bạn đã mua hàng.</p>
        {paymentStatus && <p className='mt-2 text-gray-600'>Trạng thái đơn hàng: {paymentStatus}</p>}
      </div>
    </div>
  );
}
