import { Box, Divider, Flex, Group, Stack, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import { SearchInput } from '~/components/Search/SearchInput';
import { api } from '~/trpc/server';
import { CreatePaymentButton } from './components/Button';
import TablePayment from './components/Table/TablePayment';
export const metadata: Metadata = {
  title: 'Quản lý thanh toán '
};
export default async function PaymentManagementPage({
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
  const allData = await api.Payment.getAll();
  const data = await api.Payment.find({ skip: +currentPage, take: +limit, s });

  return (
    <>
      <Divider my={'md'} />
      <Stack gap={'lg'} pb={'xl'} mb={'xl'}>
        <Flex align={'center'} justify={'space-between'}>
          <Box>
            <Title mb={4} className='font-quicksand' order={2}>
              Quản lý thanh toán
            </Title>
            <Text size='sm' c={'dimmed'}>
              Quản lí việc thanh toán trong hệ thống PhungFood
            </Text>
          </Box>
        </Flex>
        <Group justify='space-between' mb='md'>
          <Text fw={500}>Số lượng bản ghi: {allData && allData?.data.length}</Text>
          <Group>
            <SearchInput />
            <CreatePaymentButton />
          </Group>
        </Group>
        <TablePayment data={data} allData={allData} s={s} />
      </Stack>
    </>
  );
}
