import { OrderStatus } from '@prisma/client';
import { redirect } from 'next/navigation';
import { api } from '~/trpc/server';
import CheckoutClient from '../_components/Client/CheckoutClient';

const formatTransDate = (date: Date) => {
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}`;
};

async function CheckoutPage({ params }: { params: { slug: string } }) {
  const orderId = params?.slug;

  const order = await api.Order.getOne({ query: orderId });
  if (!order?.id) {
    redirect(`/vnpay-payment-result?error=Không tìm thấy đơn hàng hoặc ngày giao dịch&message=Đơn hàng không tồn tại.`);
  }

  if (order.status === OrderStatus.COMPLETED) {
    redirect(
      `/vnpay-payment-result?orderId=${orderId}&transDate=${formatTransDate(order.transDate || new Date())}&message=Đơn hàng đã được thanh toán`
    );
  }
  return <CheckoutClient order={order} orderId={orderId} />;
}

export default CheckoutPage;
