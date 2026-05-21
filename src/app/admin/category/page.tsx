import { Box, Divider, Flex, Stack, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import { api, HydrateClient } from '~/trpc/server';
import CategoryClientManagementPage from './components/PageClient';

export const revalidate = 60 * 60;
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Quản lý danh mục'
};
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
  const page = searchParams?.page || '1';
  const limit = searchParams?.limit || '5';
  await Promise.allSettled([
    api.Category.getAll.prefetch(),
    api.Category.find.prefetch({ page: +page, limit: +limit, s }),
    api.SubCategory.find.prefetch({ page: +page, limit: +limit, s })
  ]);
  return (
    <HydrateClient>
      <Divider my={'md'} />
      <Stack gap={'lg'} pb={'xl'} mb={'xl'}>
        <Flex align={'center'} justify={'space-between'} mb={'md'}>
          <Box>
            <Title mb={4} className='font-quicksand' order={2}>
              Quản lý danh mục
            </Title>
            <Text size='sm' c={'dimmed'}>
              Danh sách tất cả danh mục sản phẩm trong hệ thống PhungFood
            </Text>
          </Box>
        </Flex>

        <CategoryClientManagementPage />
      </Stack>
    </HydrateClient>
  );
}
