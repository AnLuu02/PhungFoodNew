import { Card, Group, Text, Title } from '@mantine/core';
import { getServerSession } from 'next-auth';
import SearchQueryParams from '~/app/_components/Search/SearchQueryParams';
import { authOptions } from '~/app/api/auth/[...nextauth]/options';
import { api } from '~/trpc/server';
import { CreateCategoryButton, CreateManyCategoryButton } from './components/Button';
import TableCategory from './components/Table/TableCategory';

export default async function CategoryManagementPage({
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
  const totalData = await api.Category.getAll();
  const user = await getServerSession(authOptions);
  const data = await api.Category.find({ skip: +currentPage, take: +limit, s });

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
          <SearchQueryParams />
          {(user?.user?.role === 'ADMIN' || user?.user?.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN) && (
            <>
              <CreateCategoryButton />
              <CreateManyCategoryButton />
            </>
          )}
        </Group>
      </Group>

      <TableCategory data={data} s={s} user={user} />
    </Card>
  );
}
