import { Card, Group, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/app/api/auth/[...nextauth]/options';
import SearchQueryParams from '~/components/Search/SearchQueryParams';
import { api } from '~/trpc/server';
import { CreateManyMaterialButton, CreateMaterialButton } from './components/Button';
import TableMaterial from './components/Table/TableMaterial';
export const metadata: Metadata = {
  title: 'Quản lý nguyên liệu '
};
export default async function MaterialManagementPage({
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
  const totalData = await api.Material.getAll();
  const user = await getServerSession(authOptions);
  const data = await api.Material.find({ skip: +currentPage, take: +limit, s });

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder mt='md'>
      <Title mb='xs' className='font-quicksand'>
        Quản lý nguyên liệu
      </Title>
      <Group justify='space-between' mb='md'>
        <Text fw={500} size='md'>
          Số lượng bản ghi: {totalData && totalData?.length}
        </Text>
        <Group>
          <SearchQueryParams />
          {user?.user?.role === 'ADMIN' ||
            (user?.user?.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN && (
              <>
                <CreateMaterialButton />
                <CreateManyMaterialButton />
              </>
            ))}
        </Group>
      </Group>

      <TableMaterial data={data} s={s} user={user} />
    </Card>
  );
}
