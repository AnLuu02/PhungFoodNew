import { Box } from '@mantine/core';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/app/api/auth/[...nextauth]/options';
import { api } from '~/trpc/server';
import { UserOne } from '~/types/client-type-trpc';
import { DashboardContent } from './components/DashboardContent';

export const metadata: Metadata = {
  title: 'Thông tin cá nhân - Phụng Food',
  description: 'Xem và cập nhật thông tin cá nhân, đơn hàng và voucher của bạn tại Phụng Food.'
};

export default async function CustomerProfile() {
  const session = await getServerSession(authOptions);
  const [userInfor, orders, vouchers] = await Promise.allSettled([
    api.User.getOne({ s: session?.user?.email || '', hasOrders: true }),
    api.Order.getFilter({ s: session?.user?.email || '' }),
    api.Voucher.getVoucherForUser({
      userId: session?.user?.id || ''
    })
  ]);
  if (userInfor.status !== 'fulfilled') return;
  return (
    <Box py={{ base: 0, md: 'xs' }}>
      <DashboardContent
        userInfor={userInfor.value as UserOne}
        orders={orders.status === 'fulfilled' ? orders.value : []}
        vouchers={vouchers.status === 'fulfilled' ? vouchers.value : []}
      />
    </Box>
  );
}
