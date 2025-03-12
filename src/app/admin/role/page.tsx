import { Card, Group, Text, Title } from '@mantine/core';
import { getServerSession } from 'next-auth';
import Search from '~/app/_components/Admin/Search';
import { authOptions } from '~/app/api/auth/[...nextauth]/options';
import { api } from '~/trpc/server';
import { CreateRoleButton } from './components/Button';
import TableRole from './components/Table/TableCategory';
export default async function RoleManagementPage({
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
  const totalData = await api.RolePermission.getRoles();
  const user = await getServerSession(authOptions);

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder mt='md'>
      <Title mb='xs' className='font-quicksand'>
        Quản lý danh mục
      </Title>
      <Group justify='space-between' mb='md'>
        <Text fw={500} size='md'>
          Số lượng bản ghi: {totalData && totalData?.length}
        </Text>
        <Group>
          <Search /> {user?.user?.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN && <CreateRoleButton />}
        </Group>
      </Group>

      <TableRole currentPage={currentPage} query={query} limit={limit} user={user} />
    </Card>
  );
}
