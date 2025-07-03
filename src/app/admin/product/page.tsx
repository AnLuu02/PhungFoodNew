import { Card, Group, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/app/api/auth/[...nextauth]/options';
import SearchQueryParams from '~/components/Search/SearchQueryParams';
import { api } from '~/trpc/server';
import { CreateProductButton } from './components/Button';
import TableProduct from './components/Table/TableProduct';
export const metadata: Metadata = {
  title: 'Quản lý sản phẩm '
};
export default async function ProductManagementPage({
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
  const totalData = await api.Product.getAll({ userRole: 'ADMIN' });
  const user = await getServerSession(authOptions);
  const data = await api.Product.find({
    skip: +currentPage,
    take: +limit,
    userRole: 'ADMIN',
    s
  });
  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder mt='md'>
      <Title mb='xs' className='font-quicksand'>
        Quản lý sản phẩm
      </Title>

      <Group justify='space-between' mb='md'>
        <Text fw={500}>Số lượng bản ghi: {totalData && totalData?.length}</Text>
        <Group>
          <SearchQueryParams />
          {user?.user?.role === 'ADMIN' ||
            (user?.user?.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN && <CreateProductButton />)}
        </Group>
      </Group>

      <TableProduct data={data} s={s} user={user} />
    </Card>
  );
}
