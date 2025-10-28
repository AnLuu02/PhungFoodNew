import { Box, Divider, Flex, Group, Stack, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import { SearchInput } from '~/components/Search/SearchInput';
import { LocalOrderStatus } from '~/lib/ZodSchema/enum';
import { api } from '~/trpc/server';
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
  const currentPage = searchParams?.page || '1';
  const limit = searchParams?.limit ?? '5';
  const filter = searchParams?.filter as LocalOrderStatus;
  const sortArr = (
    searchParams?.sort && Array.isArray(searchParams?.sort) ? searchParams?.sort : [searchParams?.sort]
  )?.filter(Boolean);
  const allData = await api.Order.getAll();
  const data = await api.Order.find({ skip: +currentPage, take: +limit, s, filter, sort: sortArr });
  return (
    <>
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
        </Flex>
        <Group justify='space-between' mb='md'>
          <Text fw={500}>Số lượng bản ghi: {allData && allData?.length}</Text>
          <Group>
            <SearchInput />
            <CreateOrderButton />
            <SendMessageAllUserAdvanced />
          </Group>
        </Group>
        <TableOrder data={data} s={s} allData={allData} />
      </Stack>
    </>
  );
}
