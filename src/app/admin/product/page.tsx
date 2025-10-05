import { Box, Divider, Flex, Stack, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/app/api/auth/[...nextauth]/options';
import { UserRole } from '~/constants';
import { api } from '~/trpc/server';
import { CreateProductButton } from './components/Button';
import TableProduct from './components/Table/TableProduct';
export const metadata: Metadata = {
  title: 'Quản lý sản phẩm '
};
export default async function ProductManagementPage({
  searchParams
}: {
  searchParams?: {
    s?: string;
    page?: string;
    limit?: string;
    filter?: string;
  };
}) {
  const s = searchParams?.s || '';
  const currentPage = searchParams?.page || '1';
  const limit = searchParams?.limit ?? '3';
  const [allData, user, data] = await Promise.all([
    api.Product.getAll({ userRole: UserRole.ADMIN }),
    getServerSession(authOptions),
    api.Product.find({
      skip: +currentPage,
      take: +limit,
      userRole: UserRole.ADMIN,
      s,
      filter: searchParams?.filter + '@#@$@@'
    })
  ]);

  return (
    <>
      <Divider my={'md'} />
      <Stack gap={'lg'} pb={'xl'} mb={'xl'}>
        <Flex align={'center'} justify={'space-between'} mb={'md'}>
          <Box>
            <Title mb={4} className='font-quicksand' order={2}>
              Quản lý sản phẩm
            </Title>
            <Text size='sm' c={'dimmed'}>
              Danh sách tất cả sản phẩm trong hệ thống PhungFood
            </Text>
          </Box>
          <CreateProductButton />
        </Flex>

        <TableProduct data={data} s={s} user={user} allData={allData} />
      </Stack>
    </>
  );
}
