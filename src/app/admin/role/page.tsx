import { Card, Group, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/app/api/auth/[...nextauth]/options';
import SearchInput from '~/components/Search/search-input';
import { api } from '~/trpc/server';
import { CreateManyRoleButton, CreateRoleButton } from './components/Button';
import TableRole from './components/Table/TableCategory';
export const metadata: Metadata = {
  title: 'Quản lý quyền '
};
export default async function RoleManagementPage({
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
  const totalData = await api.RolePermission.getAllRole();
  const user = await getServerSession(authOptions);
  const data = await api.RolePermission.find({ skip: +currentPage, take: +limit, s });

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder mt='md'>
      <Title mb='xs' className='font-quicksand'>
        Quản vai trò
      </Title>
      <Group justify='space-between' mb='md'>
        <Text fw={500} size='md'>
          Số lượng bản ghi: {totalData && totalData?.length}
        </Text>
        <Group>
          <SearchInput />{' '}
          {user?.user?.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN && (
            <>
              <CreateRoleButton />
              <CreateManyRoleButton />
            </>
          )}
        </Group>
      </Group>

      <TableRole data={data} s={s} user={user} />
    </Card>
  );
}
