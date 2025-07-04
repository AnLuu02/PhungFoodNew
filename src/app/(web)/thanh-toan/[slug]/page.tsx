import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { formatTransDate } from '~/lib/func-handler/formatDate';
import { LocalOrderStatus } from '~/lib/zod/EnumType';
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
    redirect(`/vnpay-payment-result?error=Không tìm thấy đơn hàng hoặc ngày giao dịch&message=Đơn hàng không tồn tại.`);
  }

  if (order.status !== LocalOrderStatus.PROCESSING && order.status !== LocalOrderStatus.CANCELLED) {
    redirect(
      `/vnpay-payment-result?orderId=${orderId}&transDate=${formatTransDate(order.transDate || new Date())}&statusOrder=${order.status}&message=Đơn hàng đã được thanh toán`
    );
  }
  return <CheckoutClient order={order} orderId={orderId} />;
}

export default CheckoutPage;
