import { Box, Divider, Flex, Stack, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import { api, HydrateClient } from '~/trpc/server';
import { CreateVoucherButton } from './components/Button';
import VoucherClient from './components/PageClient';

export const revalidate = 60 * 60;
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Quản lý khuyến mãi '
};

export default async function VoucherManagementPage({
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
  await Promise.all([api.Voucher.getAll.prefetch(), api.Voucher.find.prefetch({ page: +page, limit: +limit, s })]);

  return (
    <HydrateClient>
      <Divider my={'md'} />
      <Stack gap={'lg'} pb={'xl'} mb={'xl'}>
        <Flex align={'center'} justify={'space-between'} mb={'md'}>
          <Box>
            <Title mb={4} className='font-quicksand' order={2}>
              Quản lý khuyến mãi
            </Title>
            <Text size='sm' c={'dimmed'}>
              Danh sách tất cả khuyến mãi trong hệ thống PhungFood
            </Text>
          </Box>
          <CreateVoucherButton />
        </Flex>

        <VoucherClient />
      </Stack>
    </HydrateClient>
  );
}
