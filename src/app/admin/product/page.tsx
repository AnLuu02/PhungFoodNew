import { Box, Button, Divider, Flex, Group, Stack, Text, Title } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
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
  const filter = searchParams?.filter;
  await Promise.allSettled([
    api.Product.getAll.prefetch({ userRole: UserRole.ADMIN }),
    api.Product.find.prefetch({
      page: +page,
      limit: +limit,
      userRole: UserRole.ADMIN,
      s,
      filter: filter ? filter + '@#@$@@' : undefined
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
          <Group>
            <Button
              component='a'
              download
              target='_self'
              variant='outline'
              href={`/api/export/xlsx?type=products&limit=${limit}&page=${page}&s=${s}`}
              leftSection={<IconDownload size={16} />}
            >
              Export danh sách mặc hàng
            </Button>
            <CreateProductButton />
          </Group>
        </Flex>

        <TableProduct />
      </Stack>
    </HydrateClient>
  );
}
