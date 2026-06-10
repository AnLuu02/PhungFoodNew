import { Box } from '@mantine/core';
import { Metadata } from 'next';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/server';

import { DashboardContent } from './components/DashboardContent';
import { OverviewUser } from './components/OverviewUser';

export const revalidate = 60 * 60;

export const metadata: Metadata = {
  title: 'Thông tin cá nhân - Phụng Food',
  description: 'Xem và cập nhật thông tin cá nhân, đơn hàng và voucher của bạn tại Phụng Food.'
};

export default async function CustomerProfile() {
  const session = await getServerAuthSession();
  const result = await api.User.getOverviewUser({
    key: session?.user?.id || ''
  });
  return (
    <Box py={{ base: 0, md: 'xs' }}>
      <OverviewUser overviewUser={result} session={session} />
      <DashboardContent user={result?.user} session={session} />
    </Box>
  );
}
