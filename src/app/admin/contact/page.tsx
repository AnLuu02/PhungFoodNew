import { Box, Divider, Flex, Stack, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import { api } from '~/trpc/server';
import TableContact from './components/Table/TableContact';
export const metadata: Metadata = {
  title: 'Quản lý liên hệ của khách ahngf '
};
export default async function ContactManagementPage({
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
  const allData = await api.Contact.getAll();
  const data = await api.Contact.find({ skip: +currentPage, take: +limit, s });

  return (
    <>
      <Divider my={'md'} />
      <Stack gap={'lg'} pb={'xl'} mb={'xl'}>
        <Flex align={'center'} justify={'space-between'}>
          <Box>
            <Title mb={4} className='font-quicksand' order={2}>
              Quản lý liên hệ của khách hàng
            </Title>
            <Text size='sm' c={'dimmed'}>
              Danh sách tất cả liên hệ của khách hàng trong hệ thống PhungFood
            </Text>
          </Box>
        </Flex>

        <TableContact allData={allData} data={data} s={s} />
      </Stack>
    </>
  );
}
