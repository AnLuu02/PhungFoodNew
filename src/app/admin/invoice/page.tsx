import { Box, Divider, Flex, Group, Stack, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import { SearchInput } from '~/components/Search/SearchInput';
import { api } from '~/trpc/server';
import { CreateInvoiceButton } from './components/Button';
import TableInvoice from './components/Table/TableInvoice';
export const metadata: Metadata = {
  title: 'Quản lý hóa đơn '
};
export default async function InvoiceManagementPage({
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
  const limit = searchParams?.limit ?? '3';
  const allData = await api.Invoice.getAll();
  const data = await api.Invoice.find({ skip: +currentPage, take: +limit, s });

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
              Danh sách tất cả người dùng trong hệ thống PhungFood
            </Text>
          </Box>
          <CreateInvoiceButton allData={allData?.data || []} />
        </Flex>

        <Group justify='space-between'>
          <Text fw={500} size='md'>
            Số lượng bản ghi: {allData && allData?.data?.length}
          </Text>
          <Group>
            <SearchInput />
          </Group>
        </Group>

        <TableInvoice allData={allData} data={data} s={s} />
      </Stack>
    </>
  );
}
