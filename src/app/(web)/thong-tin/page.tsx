import { Box } from '@mantine/core';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/server/auth/options';
import { api, HydrateClient } from '~/trpc/server';
import { DashboardContent } from './components/DashboardContent';

export const revalidate = 60 * 60;

export const metadata: Metadata = {
  title: 'Thông tin cá nhân - Phụng Food',
  description: 'Xem và cập nhật thông tin cá nhân, đơn hàng và voucher của bạn tại Phụng Food.'
};

export default async function CustomerProfile() {
  const session = await getServerSession(authOptions);
  await Promise.all([
    api.User.getOne.prefetch({ key: session?.user?.email || '', include: { order: true } }),
    api.Order.getFilter.prefetch({ s: session?.user?.email || '' }),
    api.Voucher.getVoucherForUser.prefetch({
      userId: session?.user?.id || ''
    })
  ]);
  return (
    <HydrateClient>
      <Box py={{ base: 0, md: 'xs' }}>
        <DashboardContent userId={session?.user?.id || ''} />
      </Box>
    </HydrateClient>
  );
}
