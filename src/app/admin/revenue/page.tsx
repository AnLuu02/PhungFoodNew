import { Card, Title } from '@mantine/core';
import { Metadata } from 'next';
import { api } from '~/trpc/server';
import TableRevenue from './components/Table/TableRevenue';
export const metadata: Metadata = {
  title: 'Quản lý doanh thu '
};
export default async function RevenueManagementPage({
  searchParams
}: {
  searchParams?: {
    revenue?: string;
    page?: string;
    limit?: string;
  };
}) {
  const revenues = await api.Revenue.getAll();
  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder mt='md'>
      <Title mb='xs' className='font-quicksand'>
        Quản lý doanh thu
      </Title>
      <TableRevenue revenues={revenues} />
    </Card>
  );
}
