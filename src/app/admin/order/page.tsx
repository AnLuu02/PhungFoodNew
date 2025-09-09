import { Card, Group, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/app/api/auth/[...nextauth]/options';
import SearchInput from '~/components/Search/search-input';
import { api } from '~/trpc/server';
import { CreateOrderButton, SendMessageAllUserAdvanced } from './components/Button';
import TableOrder from './components/Table/TableOrder';
export const metadata: Metadata = {
  title: 'Quản lý hóa đơn '
};
export default async function OrderManagementPage({
  searchParams
}: {
  searchParams?: {
    s?: string;
    page?: string;
    limit?: string;
  };
}) {
  const s = searchParams?.s || '';
  const currentPage = searchParams?.page || '1';
  const limit = searchParams?.limit ?? '3';
  const totalData = await api.Order.getAll();
  const user = await getServerSession(authOptions);
  const data = await api.Order.find({ skip: +currentPage, take: +limit, s });
  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder mt='md'>
      <Title mb='xs' className='font-quicksand'>
        Quản lý hóa đơn
      </Title>
      <Group justify='space-between' mb='md'>
        <Text fw={500}>Số lượng bản ghi: {totalData && totalData?.length}</Text>
        <Group>
          <SearchInput />
          <CreateOrderButton />
          <SendMessageAllUserAdvanced />
        </Group>
      </Group>

      <TableOrder data={data} s={s} user={user} />
    </Card>
  );
}
