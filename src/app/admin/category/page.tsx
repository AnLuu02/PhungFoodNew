import { Box, Divider, Flex, Stack, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import { api } from '~/trpc/server';
import CategoryClientManagementPage from './components/categoryClient';
export const metadata: Metadata = {
  title: 'Quản lý danh mục '
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
  const currentPage = searchParams?.page || '1';
  const limit = searchParams?.limit ?? '5';
  const [allData, dataCategory, dataSubCategory] = await Promise.all([
    api.Category.getAll(),
    api.Category.find({ skip: +currentPage, take: +limit, s }),
    api.SubCategory.find({ skip: +currentPage, take: +limit, s })
  ]);
  return (
    <>
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

        <CategoryClientManagementPage
          s={s}
          allData={allData}
          dataCategory={dataCategory}
          dataSubCategory={dataSubCategory}
        />
      </Stack>
    </>
  );
}
