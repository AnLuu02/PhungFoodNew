import { Card, Group, Text, Title } from '@mantine/core';
import { getServerSession } from 'next-auth';
import Search from '~/app/_components/Admin/Search';
import { authOptions } from '~/app/api/auth/[...nextauth]/options';
import { api } from '~/trpc/server';
import { CreatePermissionButton } from './components/Button';
import TablePermission from './components/Table/TablePermissions';
export default async function PermissionManagementPage({
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
  const totalData = await api.RolePermission.getPermissions();
  const user = await getServerSession(authOptions);

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder mt='md'>
      <Title mb='xs' className='font-quicksand'>
        Quản lý quyền hạn
      </Title>
      <Group justify='space-between' mb='md'>
        <Text fw={500} size='md'>
          Số lượng bản ghi: {totalData && totalData?.length}
        </Text>
        <Group>
          <Search />
          {user?.user?.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN && <CreatePermissionButton />}
        </Group>
      </Group>

      <TablePermission currentPage={currentPage} query={query} limit={limit} user={user} />
    </Card>
  );
}
