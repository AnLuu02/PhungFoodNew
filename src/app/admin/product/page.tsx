import { Box, Divider, Flex, Stack, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import { UserRole } from '~/shared/constants/user.constants';
import { api, HydrateClient } from '~/trpc/server';
import { CreateProductButton } from './components/Button';
import TableProduct from './components/Table/TableProduct';

export const revalidate = 60 * 60;
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Quản lý sản phẩm '
};
export default async function ProductManagementPage({
  searchParams
}: {
  searchParams?: {
    s?: string;
    page?: string;
    limit?: string;
    filter?: string;
  };
}) {
  const s = searchParams?.s || '';
  const page = searchParams?.page || '1';
  const limit = searchParams?.limit ?? '5';
  await Promise.allSettled([
    api.Product.getAll.prefetch({ userRole: UserRole.ADMIN }),
    api.Product.find.prefetch({
      page: +page,
      limit: +limit,
      userRole: UserRole.ADMIN,
      s,
      filter: searchParams?.filter + '@#@$@@'
    })
  ]);

  return (
    <HydrateClient>
      <Divider my={'md'} />
      <Stack gap={'lg'} pb={'xl'} mb={'xl'}>
        <Flex align={'center'} justify={'space-between'} mb={'md'}>
          <Box>
            <Title mb={4} className='font-quicksand' order={2}>
              Quản lý sản phẩm
            </Title>
            <Text size='sm' c={'dimmed'}>
              Danh sách tất cả sản phẩm trong hệ thống PhungFood
            </Text>
          </Box>
          <CreateProductButton />
        </Flex>

        <TableProduct />
      </Stack>
    </HydrateClient>
  );
}
