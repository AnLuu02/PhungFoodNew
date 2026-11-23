import { Box } from '@mantine/core';
import { Metadata } from 'next';

import { DashboardContent } from '~/app/(web)/thong-tin/components/dashboard-content';
import { OverviewUser } from '~/app/(web)/thong-tin/components/overview-user';

export const revalidate = 60 * 60;
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Thông tin cá nhân - Phụng Food',
  description: 'Xem và cập nhật thông tin cá nhân, đơn hàng và voucher của bạn tại Phụng Food.'
};

export default async function CustomerProfile() {
  return (
    <Box py={{ base: 0, md: 'xs' }}>
      <OverviewUser />
      <DashboardContent />
    </Box>
  );
}
