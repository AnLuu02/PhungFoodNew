import { Box, Divider, Flex, Stack, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import { api } from '~/trpc/server';
import { CreateUserButton } from './components/Button';
import TableUser from './components/Table/TableUser';
export const metadata: Metadata = {
  title: 'Quản lý người dùng '
};

export default async function UserManagementPage({
  searchParams
}: {
  searchParams?: {
    s?: string;
    page?: string;
    limit?: string;
    sort?: string;
    filter?: string;
  };
}) {
  const s = searchParams?.s || '';
  const page = searchParams?.page || '1';
  const limit = searchParams?.limit ?? '5';
  const allData = await api.User.getAll();
  const sortArr: string[] = (
    searchParams?.sort && Array.isArray(searchParams?.sort) ? searchParams?.sort : [searchParams?.sort]
  )?.filter(Boolean);
  const filter = searchParams?.filter + '@#@$@@';
  const data = await api.User.find({
    skip: +page,
    take: +limit,
    s,
    sort: sortArr,
    filter
  });
  return (
    <>
      <Divider my={'md'} />
      <Stack gap={'lg'} pb={'xl'} mb={'xl'}>
        <Flex align={'center'} justify={'space-between'} mb={'md'}>
          <Box>
            <Title mb={4} className='font-quicksand' order={2}>
              Quản lý người dùng
            </Title>
            <Text size='sm' c={'dimmed'}>
              Danh sách tất cả người dùng trong hệ thống PhungFood
            </Text>
          </Box>
          <CreateUserButton />
        </Flex>

        <TableUser data={data} allData={allData} queryParams={{ s, page, limit, sortArr, filter }} />
      </Stack>
    </>
  );
}
