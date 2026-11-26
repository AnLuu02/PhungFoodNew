import { Box, Divider, Flex, Group, Stack, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import { CreateInvoiceButton } from '~/app/admin/invoice/components/button';
import TableInvoice from '~/app/admin/invoice/components/tables/table-invoice';
import PageSizeSelector from '~/components/common/per-page';
import { SearchInput } from '~/components/search/search-input';
import { api, HydrateClient } from '~/trpc/server';

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
    api.Invoice.admin.getSummary.prefetch(),
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
            <SearchInput w={300} />
            <CreateInvoiceButton />
          </Group>
        </Flex>

        <TableInvoice />
      </Stack>
    </HydrateClient>
  );
}
