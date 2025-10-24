import { Box, Divider, Flex, Stack, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import { api } from '~/trpc/server';
import { CreateMaterialButton } from './components/Button';
import TableMaterial from './components/Table/TableMaterial';
export const metadata: Metadata = {
  title: 'Quản lý nguyên liệu '
};
export default async function MaterialManagementPage({
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
  const limit = searchParams?.limit ?? '5';
  const allData = await api.Material.getAll();
  const data = await api.Material.find({ skip: +currentPage, take: +limit, s });

  return (
    <>
      <Divider my={'md'} />
      <Stack gap={'lg'} pb={'xl'} mb={'xl'}>
        <Flex align={'center'} justify={'space-between'}>
          <Box>
            <Title mb={4} className='font-quicksand' order={2}>
              Quản lý nguyên liệu
            </Title>
            <Text size='sm' c={'dimmed'}>
              Danh sách tất cả nguyên liệu trong hệ thống PhungFood
            </Text>
          </Box>
          <CreateMaterialButton />
        </Flex>

        <TableMaterial allData={allData} data={data} s={s} />
      </Stack>
    </>
  );
}
