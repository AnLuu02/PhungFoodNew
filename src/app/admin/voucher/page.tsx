import { Box, Button, Divider, Flex, Group, Stack, Text, Title } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
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
    status?: string[];
    type?: string;
  };
}) {
  const s = searchParams?.s || '';
  const page = searchParams?.page || '1';
  const limit = searchParams?.limit ?? '5';
  const status = searchParams?.status ?? [];
  const type = searchParams?.type ?? undefined;

  await Promise.all([
    api.Voucher.getAll.prefetch(),
    api.Voucher.find.prefetch({ page: +page, limit: +limit, filters: { s, status, type } })
  ]);

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
          <Group>
            <Button
              component='a'
              download
              target='_self'
              variant='outline'
              href={`/api/export/xlsx?type=vouchers&limit=${limit}&page=${page}&s=${s}`}
              leftSection={<IconDownload size={16} />}
            >
              Export mã giảm giá
            </Button>
            <CreateVoucherButton />
          </Group>
        </Flex>

        <VoucherClient />
      </Stack>
    </HydrateClient>
  );
}
