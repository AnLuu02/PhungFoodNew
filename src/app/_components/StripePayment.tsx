'use client';
import { Center, Group, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { formatPriceLocaleVi } from '../lib/utils/format/formatPrice';
import BButton from './Button';
import LoadingComponent from './Loading';

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<any>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    // Xác nhận thanh toán
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-success` // Redirect sau khi thanh toán thành công
      }
    });

    if (error) {
      setErrorMessage(error.message);
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Center my={'xs'}>
        <BButton type='submit' title={isLoading ? 'Đang xử lý...' : 'Thanh toán'} size='md' radius='sm' fullWidth />
      </Center>
      {errorMessage && <div className='mt-4 text-red-500'>{errorMessage}</div>}
    </form>
  );
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutStripe() {
  const [clientSecret, setClientSecret] = useState('');
  const [cart, setCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  const discount = cart.reduce((sum, item) => {
    if (item.discount) {
      return sum + item.discount * item.quantity;
    }
    return sum;
  }, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = (subtotal - discount) * 0.1;
  const amount = subtotal + tax - discount || 500000;

  useEffect(() => {
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amount })
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret))
      .catch(error => console.error('Error fetching clientSecret:', error));
  }, []);

  if (!clientSecret) {
    return <LoadingComponent />;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <Group justify='space-between'>
        <Text size='md' fw={700}>
          Tổng cộng
        </Text>
        <Text size='xl' fw={700} c={'red'}>
          {formatPriceLocaleVi(amount)}
        </Text>
      </Group>
      <CheckoutForm />
    </Elements>
  );
}
