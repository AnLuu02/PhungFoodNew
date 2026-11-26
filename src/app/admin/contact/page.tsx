import { Box, Button, Divider, Flex, Stack, Text, Title } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { Metadata } from 'next';
import TableContact from '~/app/admin/contact/components/tables/table-contact';
import { api, HydrateClient } from '~/trpc/server';

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
  const page = searchParams?.page || '1';
  const limit = searchParams?.limit ?? '5';
  await Promise.allSettled([
    api.Contact.admin.getSummary.prefetch(),
    api.Contact.find.prefetch({ page: +page, limit: +limit, s })
  ]);

  return (
    <HydrateClient>
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
          <Button
            component='a'
            download
            target='_self'
            variant='outline'
            href={`/api/export/xlsx?type=contacts&limit=${limit}&page=${page}&s=${s}`}
            leftSection={<IconDownload size={16} />}
          >
            Export dữ liệu
          </Button>
        </Flex>

        <TableContact />
      </Stack>
    </HydrateClient>
  );
}
