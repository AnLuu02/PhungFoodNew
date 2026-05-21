import { Box, Divider, Flex, Group, Stack, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import { SearchInput } from '~/components/Search/SearchInput';
import { api, HydrateClient } from '~/trpc/server';
import { CreatePaymentButton } from './components/Button';
import TablePayment from './components/Table/TablePayment';

export const revalidate = 60 * 60;
export const dynamic = 'force-static';

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
  const page = searchParams?.page || '1';
  const limit = searchParams?.limit ?? '5';

  await Promise.allSettled([
    api.Payment.getAll.prefetch(),
    api.Payment.find.prefetch({ page: +page, limit: +limit, s })
  ]);

  return (
    <HydrateClient>
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
          <Group>
            <SearchInput />
            <CreatePaymentButton />
          </Group>
        </Flex>

        <TablePayment />
      </Stack>
    </HydrateClient>
  );
}
