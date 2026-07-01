import {
  Box,
  Button,
  Divider,
  Flex,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuLabel,
  MenuTarget,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { IconDownload, IconFileTypeXls } from '@tabler/icons-react';
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
    status?: string;
    category?: string;
  };
}) {
  const s = searchParams?.s || '';
  const page = searchParams?.page || '1';
  const limit = searchParams?.limit || '5';
  const status = (searchParams?.status as 'active' | 'inactive') ?? undefined;
  const category = searchParams?.category;
  await Promise.allSettled([
    api.Category.getAll.prefetch(),
    api.Category.find.prefetch({ page: +page, limit: +limit, s }),
    api.SubCategory.find.prefetch({ page: +page, limit: +limit, filters: { s, status, category } })
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
          <Menu shadow='md' width={200}>
            <MenuTarget>
              <Button variant='outline' leftSection={<IconDownload size={16} />}>
                Export dữ liệu
              </Button>
            </MenuTarget>

            <MenuDropdown>
              <MenuLabel>Tùy chọn xuất file</MenuLabel>

              <MenuItem
                component='a'
                download
                target='_self'
                href={`/api/export/xlsx?type=categories&limit=${limit}&page=${page}&s=${s}`}
                leftSection={<IconFileTypeXls size={16} />}
              >
                Export Danh mục
              </MenuItem>

              <MenuItem
                component='a'
                download
                href={`/api/export/xlsx?type=subCategories&limit=${limit}&page=${page}&s=${s}`}
                target='_self'
                leftSection={<IconFileTypeXls size={16} />}
              >
                Export Danh mục con
              </MenuItem>
            </MenuDropdown>
          </Menu>
        </Flex>

        <CategoryClientManagementPage />
      </Stack>
    </HydrateClient>
  );
}
