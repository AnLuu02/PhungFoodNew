import { Card, Group, Text, Title } from '@mantine/core';
import { getServerSession } from 'next-auth';
import Search from '~/app/_components/Admin/Search';
import { authOptions } from '~/app/api/auth/[...nextauth]/options';
import { api } from '~/trpc/server';
import { CreateProductButton } from './components/Button';
import TableProduct from './components/Table/TableProduct';
export default async function ProductManagementPage({
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
  const totalData = await api.Product.getAll({ userRole: 'ADMIN' });
  const user = await getServerSession(authOptions);

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder mt='md'>
      <Title mb='xs' className='font-quicksand'>
        Quản lý sản phẩm
      </Title>

      <Group justify='space-between' mb='md'>
        <Text fw={500}>Số lượng bản ghi: {totalData && totalData?.length}</Text>
        <Group>
          <Search />
          {user?.user?.role === 'ADMIN' ||
            (user?.user?.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN && <CreateProductButton />)}
        </Group>
      </Group>

      <TableProduct currentPage={currentPage} query={query} limit={limit} user={user} />
    </Card>
  );
}
