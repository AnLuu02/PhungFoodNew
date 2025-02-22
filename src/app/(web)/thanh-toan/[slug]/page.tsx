import { Metadata } from 'next';
import { api } from '~/trpc/server';
import CheckoutPageClient from '../_components/CheckoutPageClient';
type Props = {
  params: { slug: string };
};

export const metadata: Metadata = {
  title: 'Thanh toán'
};

export default async function CheckoutPage({ params }: Props) {
  const orderData = await api.Order.getOne({
    query: params.slug
  });
  const paymentData = await api.Payment.getAll();

  return <CheckoutPageClient orderData={orderData} paymentData={paymentData} />;
}
