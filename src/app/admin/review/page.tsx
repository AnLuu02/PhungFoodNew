import { Box, Divider, Flex, Stack, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import { api, HydrateClient } from '~/trpc/server';
import { CreateReviewButton } from './components/Button';
import TableReview from './components/Table/TableReview';

export const revalidate = 60 * 60;
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Quản lý đánh giá'
};
export default async function ReviewManagementPage({
  searchParams
}: {
  searchParams?: {
    s?: string;
    page?: string;
    limit?: string;
    sort?: string;
  };
}) {
  const s = searchParams?.s || '';
  const page = searchParams?.page || '1';
  const limit = searchParams?.limit ?? '5';
  const sortArr: string[] = (
    searchParams?.sort && Array.isArray(searchParams?.sort) ? searchParams?.sort : [searchParams?.sort]
  )?.filter(Boolean);

  await Promise.allSettled([
    api.Review.getAll.prefetch(),
    api.Review.find.prefetch({ page: +page, limit: +limit, s, sort: sortArr })
  ]);

  return (
    <HydrateClient>
      <Divider my={'md'} />
      <Stack gap={'lg'} pb={'xl'} mb={'xl'}>
        <Flex align={'center'} justify={'space-between'}>
          <Box>
            <Title mb={4} className='font-quicksand' order={2}>
              Quản lý đánh giá
            </Title>
            <Text size='sm' c={'dimmed'}>
              Danh sách tất cả đánh giá trong hệ thống PhungFood
            </Text>
          </Box>
          <CreateReviewButton />
        </Flex>
        <TableReview />
      </Stack>
    </HydrateClient>
  );
}
