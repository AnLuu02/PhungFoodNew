import { Box, Divider, Flex, Stack, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/app/api/auth/[...nextauth]/options';
import { api } from '~/trpc/server';
import RoleClient from './components/roleClient';
export const metadata: Metadata = {
  title: 'Quản lý phân quyền'
};
export default async function RoleManagementPage({
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
  const [allData, user, dataRole, dataPermissions] = await Promise.all([
    api.RolePermission.getAllRole(),
    getServerSession(authOptions),
    api.RolePermission.find({ skip: +currentPage, take: +limit, s }),
    api.RolePermission.findPermission({ skip: +currentPage, take: +limit, s })
  ]);

  return (
    <>
      <Divider my={'md'} />
      <Stack gap={'lg'} pb={'xl'} mb={'xl'}>
        <Flex align={'center'} justify={'space-between'} mb={'md'}>
          <Box>
            <Title mb={4} className='font-quicksand' order={2}>
              Quản lý phân quyền
            </Title>
            <Text size='sm' c={'dimmed'}>
              Phân quyền cho người dùng trong hệ thống PhungFood
            </Text>
          </Box>
        </Flex>
        <RoleClient s={s} allData={allData} dataRole={dataRole} dataPermission={dataPermissions} />
      </Stack>
    </>
  );
}
