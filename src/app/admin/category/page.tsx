import { Card, Group, Text, Title } from '@mantine/core';
import Search from '~/app/_components/Admin/Search';
import { api } from '~/trpc/server';
import { CreateCategoryButton } from './components/Button';
import TableCategory from './components/Table/TableCategory';

export default async function CategoryManagementPage({
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
  const totalData = await api.Category.getAll();

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
          <Search />
          <CreateCategoryButton />
          {/* <DeleteAllCategoryButton /> */}
        </Group>
      </Group>

      <TableCategory currentPage={currentPage} query={query} limit={limit} />
    </Card>
  );
}
