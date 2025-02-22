import { Card, Group, Text, Title } from '@mantine/core';
import Search from '~/app/_components/Admin/Search';
import { api } from '~/trpc/server';
import { CreateReviewButton } from './components/Button';
import TableReview from './components/Table/TableReview';

export default async function ReviewManagementPage({
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
  const totalData = await api.Review.getAll();

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder mt='md'>
      <Title mb='xs' className='font-quicksand'>
        Quản lý đánh giá
      </Title>
      <Group justify='space-between' mb='md'>
        <Text fw={500}>Số lượng bản ghi: {totalData && totalData?.length}</Text>
        <Group>
          <Search />
          <CreateReviewButton />
        </Group>
      </Group>

      <TableReview currentPage={currentPage} query={query} limit={limit} />
    </Card>
  );
}
