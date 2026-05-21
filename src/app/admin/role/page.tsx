import { Box, Divider, Flex, Stack, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import { api, HydrateClient } from '~/trpc/server';
import RoleClient from './components/PageClient';

export const revalidate = 60 * 60;
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Quản lý phân quyền'
};
export default async function RoleManagementPage({
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
    api.RolePermission.getAllRole.prefetch(),
    api.RolePermission.find.prefetch({ page: +page, limit: +limit, s }),
    api.RolePermission.findPermission.prefetch({ page: +page, limit: +limit, s })
  ]);

  return (
    <HydrateClient>
      <Divider my={'md'} />
      <Stack gap={'lg'} pb={'xl'} mb={'xl'}>
        <Flex align={'center'} justify={'space-between'} mb={'md'}>
          <Box>
            <Title mb={4} className='font-quicksand' order={2}>
              Quản lý phân quyền
            </Title>
            <Text size='sm' c={'dimmed'}>
              Phân quyền cho người dùng trong hệ thống PhungFood
            </Text>
          </Box>
        </Flex>
        <RoleClient />
      </Stack>
    </HydrateClient>
  );
}
