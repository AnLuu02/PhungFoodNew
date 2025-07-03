import { Card, Group, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/app/api/auth/[...nextauth]/options';
import SearchQueryParams from '~/components/Search/SearchQueryParams';
import { api } from '~/trpc/server';
import { CreateUserButton } from './components/Button';
import TableUser from './components/Table/TableUser';
export const metadata: Metadata = {
  title: 'Quản lý người dùng '
};
export default async function UserManagementPage({
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
  const totalData = await api.User.getAll();
  const user = await getServerSession(authOptions);
  const data = await api.User.find({ skip: +currentPage, take: +limit, s });

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder mt='md'>
      <Title mb='xs' className='font-quicksand'>
        Quản lý người dùng
      </Title>

      <Group justify='space-between' mb='md'>
        <Text fw={500}>Số lượng bản ghi: {totalData && totalData?.length}</Text>
        <Group>
          <SearchQueryParams />
          {user?.user?.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN && <CreateUserButton />}
        </Group>
      </Group>

      <TableUser data={data} s={s} user={user} />
    </Card>
  );
}
