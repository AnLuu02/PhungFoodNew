import { Box, Divider, Flex, Stack, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/app/api/auth/[...nextauth]/options';
import { api } from '~/trpc/server';
import { CreateVoucherButton } from './components/Button';
import VoucherClient from './components/voucherClient';
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
  const currentPage = searchParams?.page || '1';
  const limit = searchParams?.limit ?? '3';
  const [allData, user, data] = await Promise.all([
    api.Voucher.getAll(),
    getServerSession(authOptions),
    api.Voucher.find({ skip: +currentPage, take: +limit, s })
  ]);

  return (
    <>
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

        <VoucherClient s={s} data={data} allData={allData} />
      </Stack>
    </>
  );
}
