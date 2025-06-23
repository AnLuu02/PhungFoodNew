import { Box } from '@mantine/core';
import { Metadata } from 'next';
import DashboardContent from './_components/dashboard-content';
export const metadata: Metadata = {
  title: 'Thông tin khách hàng',
  description: 'Thông tin khách hàng'
};
export default function CustomerProfile() {
  return (
    <Box py={{ base: 0, md: 'xs' }}>
      <DashboardContent />
    </Box>
  );
}
