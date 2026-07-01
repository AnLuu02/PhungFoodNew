import { Box, Button, Divider, Flex, Group, Stack, Text, Title } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { Metadata } from 'next';
import { SearchInput } from '~/components/Search/SearchInput';
import { api, HydrateClient } from '~/trpc/server';
import { CreateOrderButton, SendMessageAllUserAdvanced } from './components/Button';
import TableOrder from './components/Table/TableOrder';
export const metadata: Metadata = {
  title: 'Quản lý hóa đơn '
};
export default async function OrderManagementPage({
  searchParams
}: {
  searchParams?: {
    s?: string;
    page?: string;
    limit?: string;
    filter?: string;
    sort?: string;
  };
}) {
  const s = searchParams?.s || '';
  const page = searchParams?.page || '1';
  const limit = searchParams?.limit ?? '5';
  const filter = searchParams?.filter;
  const sortArr: string[] = (
    searchParams?.sort && Array.isArray(searchParams?.sort) ? searchParams?.sort : [searchParams?.sort]
  )?.filter(Boolean);

  await Promise.allSettled([
    api.Order.getAll.prefetch(),
    api.Order.find.prefetch({ page: +page, limit: +limit, s, filter, sort: sortArr })
  ]);
  return (
    <HydrateClient>
      <Divider my={'md'} />
      <Stack gap={'lg'} pb={'xl'} mb={'xl'}>
        <Flex align={'center'} justify={'space-between'}>
          <Box>
            <Title mb={4} className='font-quicksand' order={2}>
              Quản lý hóa đơn
            </Title>
            <Text size='sm' c={'dimmed'}>
              Danh sách tất cả hóa đơn trong hệ thống PhungFood
            </Text>
          </Box>
          <Button
            component='a'
            download
            target='_self'
            variant='outline'
            href={`/api/export/xlsx?type=orders&limit=${limit}&page=${page}&s=${s}`}
            leftSection={<IconDownload size={16} />}
          >
            Export danh sách đơn hàng
          </Button>
        </Flex>
        <Group justify='end' mb='md'>
          <Group>
            <SearchInput />
            <CreateOrderButton />
            <SendMessageAllUserAdvanced />
          </Group>
        </Group>
        <TableOrder />
      </Stack>
    </HydrateClient>
  );
}
