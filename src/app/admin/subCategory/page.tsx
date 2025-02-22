import { Card, Group, Text, Title } from '@mantine/core';
import Search from '~/app/_components/Admin/Search';
import { api } from '~/trpc/server';
import { CreateSubCategoryButton } from './components/Button';
import TableSubCategory from './components/Table/TableSubCategory';

export default async function SubCategoryManagementPage({
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
  const totalData = await api.SubCategory.getAll();

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder mt='md'>
      <Title mb='xs' className='font-quicksand'>
        Quản lý danh mục con
      </Title>
      <Group justify='space-between' mb='md'>
        <Text fw={500} size='md'>
          Số lượng bản ghi: {totalData && totalData?.length}
        </Text>
        <Group>
          <Search />
          <CreateSubCategoryButton />
          {/* <DeleteAllSubCategoryButton /> */}
        </Group>
      </Group>

      <TableSubCategory currentPage={currentPage} query={query} limit={limit} />
    </Card>
  );
}
