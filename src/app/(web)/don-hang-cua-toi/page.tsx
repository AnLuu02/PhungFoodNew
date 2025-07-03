import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/app/api/auth/[...nextauth]/options';
import { api } from '~/trpc/server';
import MyOrderPageClient from './pageClient';
export const metadata: Metadata = {
  title: 'Đơn hàng của bạn',
  description: 'Đơn hàng của bạn'
};

export default async function MyOrderPage() {
  const user = await getServerSession(authOptions);
  const orders = await api.Order.getFilter({ s: user?.user?.email || '' });
  return <MyOrderPageClient data={orders} />;
}
