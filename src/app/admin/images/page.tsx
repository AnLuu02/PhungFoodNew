import { Card, Group, Text, Title } from '@mantine/core';
import SearchQueryParams from '~/app/_components/Search/SearchQueryParams';
import { api } from '~/trpc/server';
import { CreateImageButton } from './components/Button';
import ListImage from './components/ListImages/ListImages';

export default async function ImageManagementPage({
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
  const totalData = await api.Image.getAll();

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder mt='md'>
      <Title mb='xs' className='font-quicksand'>
        Quản lý ảnh
      </Title>

      <Group justify='space-between' mb='md'>
        <Text fw={500}>Số lượng bản ghi: {totalData && totalData?.length}</Text>
        <Group>
          <SearchQueryParams />
          <CreateImageButton />
        </Group>
      </Group>

      <ListImage currentPage={currentPage} s={s} limit={limit} />
    </Card>
  );
}
