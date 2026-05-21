import { Box, Divider, Flex, Group, Stack, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import PageSizeSelector from '~/components/Perpage';
import { SearchInput } from '~/components/Search/SearchInput';
import { api, HydrateClient } from '~/trpc/server';
import { CreateInvoiceButton } from './components/Button';
import TableInvoice from './components/Table/TableInvoice';

export const revalidate = 60 * 60;
export const dynamic = 'force-static';

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
  const page = searchParams?.page || '1';
  const limit = searchParams?.limit ?? '5';
  await Promise.allSettled([
    api.Invoice.getAll.prefetch(),
    api.Invoice.find.prefetch({ page: +page, limit: +limit, s })
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
          <Group>
            <PageSizeSelector />
            <SearchInput width={300} />
            <CreateInvoiceButton />
          </Group>
        </Flex>

        <TableInvoice />
      </Stack>
    </HydrateClient>
  );
}
