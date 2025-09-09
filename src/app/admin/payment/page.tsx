import { Card, Group, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/app/api/auth/[...nextauth]/options';
import SearchInput from '~/components/Search/search-input';
import { api } from '~/trpc/server';
import { CreatePaymentButton } from './components/Button';
import TablePayment from './components/Table/TablePayment';
export const metadata: Metadata = {
  title: 'Quản lý thanh toán '
};
export default async function PaymentManagementPage({
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
  const totalData = await api.Payment.getAll();
  const user = await getServerSession(authOptions);
  const data = await api.Payment.find({ skip: +currentPage, take: +limit, s });

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder mt='md'>
      <Title mb='xs' className='font-quicksand'>
        Quản lý thanh toán
      </Title>

      <Group justify='space-between' mb='md'>
        <Text fw={500}>Số lượng bản ghi: {totalData && totalData?.length}</Text>
        <Group>
          <SearchInput />
          {user?.user?.role === 'ADMIN' ||
            (user?.user?.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN && <CreatePaymentButton />)}
        </Group>
      </Group>

      <TablePayment data={data} s={s} user={user} />
    </Card>
  );
}
