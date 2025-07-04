import { Box } from '@mantine/core';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/app/api/auth/[...nextauth]/options';
import { getValueLevelUser } from '~/lib/func-handler/level-user';
import { LocalUserLevel } from '~/lib/zod/EnumType';
import { api } from '~/trpc/server';
import DashboardContent from './components/dashboard-content';

export const metadata: Metadata = {
  title: 'Thông tin khách hàng - Phụng Food',
  description: 'Xem và cập nhật thông tin cá nhân, đơn hàng và voucher của bạn tại Phụng Food.'
};
export default async function CustomerProfile() {
  const user = await getServerSession(authOptions);
  const [userInfor, orders, vouchers] = await Promise.allSettled([
    api.User.getOne({ s: user?.user?.email || '', hasOrders: true }),
    api.Order.getFilter({ s: user?.user?.email || '' }),
    api.Voucher.getFilter({
      applyAllProduct: true,
      someLevel: getValueLevelUser(user?.user?.details?.level || LocalUserLevel.BRONZE)
    })
  ]);
  return (
    <Box py={{ base: 0, md: 'xs' }}>
      <DashboardContent
        userInfor={userInfor.status === 'fulfilled' ? userInfor.value : {}}
        orders={orders.status === 'fulfilled' ? orders.value : []}
        vouchers={vouchers.status === 'fulfilled' ? vouchers.value : []}
      />
    </Box>
  );
}
