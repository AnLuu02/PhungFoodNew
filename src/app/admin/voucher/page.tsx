import { Card, Group, Text, Title } from '@mantine/core';
import Search from '~/app/_components/Admin/Search';
import { api } from '~/trpc/server';
import { CreateVoucherButton } from './components/Button';
import TableVoucher from './components/Table/TableVoucher';

export default async function VoucherManagementPage({
  searchParams
}: {
  searchParams?: {
    query?: string;
    page?: string;
    limit?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = searchParams?.page || '1';
  const limit = searchParams?.limit ?? '3';
  const totalData = await api.Voucher.getAll();

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder mt='md'>
      <Title mb='xs' className='font-quicksand'>
        Quản lý thanh toán
      </Title>

      <Group justify='space-between' mb='md'>
        <Text fw={500}>Số lượng bản ghi: {totalData && totalData?.length}</Text>
        <Group>
          <Search />
          <CreateVoucherButton />
        </Group>
      </Group>

      <TableVoucher currentPage={currentPage} query={query} limit={limit} />
    </Card>
  );
}
