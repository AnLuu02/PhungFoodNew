import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { api } from '~/trpc/server';
import CheckoutClient from '../components/CheckoutClient';

export const metadata: Metadata = {
  title: 'Thanh toán - Phụng Food',
  description: 'Thanh toán đơn hàng của bạn tại Phụng Food. Hoàn tất giao dịch và nhận món ăn ngon miền Tây.'
};
async function CheckoutPage({ params }: { params: { slug: string } }) {
  const orderId = params?.slug;
  const order = await api.Order.getOne({ s: orderId });

  if (!order?.id) {
    redirect(
      `/vnpay-payment-result?statusOrder=${encodeURIComponent('not_found')}${orderId ? `&orderId=${encodeURIComponent(orderId.trim())}` : ''}`
    );
  }

  // if (order.status !== LocalOrderStatus.PROCESSING && order.status !== LocalOrderStatus.CANCELLED) {
  //   const transDate = formatTransDate(order.transDate ? order.transDate.toString() : '');
  //   redirect(
  //     `/vnpay-payment-result?orderId=${encodeURIComponent(orderId.trim())}` +
  //       `&transDate=${encodeURIComponent(transDate.trim())}` +
  //       `&statusOrder=${encodeURIComponent(order.status.trim())}` +
  //       `&message=${encodeURIComponent('Đơn hàng đã được thanh toán')}`
  //   );
  // }
  return <CheckoutClient order={order} />;
}

export default CheckoutPage;
