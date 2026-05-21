import { Box, Divider, Flex, Stack, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import { api, HydrateClient } from '~/trpc/server';
import { CreateMaterialButton } from './components/Button';
import TableMaterial from './components/Table/TableMaterial';

export const revalidate = 60 * 60;
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Quản lý nguyên liệu '
};
export default async function MaterialManagementPage({
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
  const limit = searchParams?.limit ?? '5';
  await Promise.allSettled([
    api.Material.find.prefetch({ page: +page, limit: +limit, s }),
    api.Material.getAll.prefetch()
  ]);
  return (
    <HydrateClient>
      <Divider my={'md'} />
      <Stack gap={'lg'} pb={'xl'} mb={'xl'}>
        <Flex align={'center'} justify={'space-between'}>
          <Box>
            <Title mb={4} className='font-quicksand' order={2}>
              Quản lý nguyên liệu
            </Title>
            <Text size='sm' c={'dimmed'}>
              Danh sách tất cả nguyên liệu trong hệ thống PhungFood
            </Text>
          </Box>
          <CreateMaterialButton />
        </Flex>

        <TableMaterial />
      </Stack>
    </HydrateClient>
  );
}
