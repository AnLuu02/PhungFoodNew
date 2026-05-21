'use client';

import { Badge, Box, Group, Table, Text } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { CommonSkeleton } from '~/components/Loading/LoadingSkeleton';
import CustomPagination from '~/components/Pagination';
import PageSizeSelector from '~/components/Perpage';
import { formatDateViVN } from '~/lib/FuncHandler/Format';
import { FindPayment } from '~/shared/type-trpc/payment.type-trpc';
import { api } from '~/trpc/react';
import { DeletePaymentButton, UpdatePaymentButton } from '../Button';

export default function TablePayment() {
  const searchParams = useSearchParams();

  const s = searchParams.get('s') || '';
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '5';

  const { data: dataClient, isLoading } = api.Payment.find.useQuery({ page: +page, limit: +limit, s });
  const currentItems = dataClient?.payments || [];

  const utils = api.useUtils();
  useEffect(() => {
    if (dataClient?.pagination.hasNext) {
      void utils.Payment.find.prefetch({ page: +page + 1, limit: +limit, s });
    }
  }, [page]);

  return (
    <>
      <Box className={`tableAdmin w-full overflow-x-auto`}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead className='text-sm uppercase leading-normal'>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Provider</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>API Key</Table.Th>
              <Table.Th>Secret Key</Table.Th>
              <Table.Th>Client ID</Table.Th>
              <Table.Th>Client Secret</Table.Th>
              <Table.Th>Webhook URL</Table.Th>
              <Table.Th>Webhook Secret</Table.Th>
              <Table.Th>Sandbox</Table.Th>
              <Table.Th>Active</Table.Th>
              <Table.Th>Created At</Table.Th>
              <Table.Th>Thao tác</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={13}>
                  <CommonSkeleton.Table count={5} />
                </Table.Td>
              </Table.Tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((row: FindPayment['payments'][number]) => (
                <Table.Tr key={row.id}>
                  <Table.Td>{row.id}</Table.Td>
                  <Table.Td>{row.provider}</Table.Td>
                  <Table.Td>{row.name}</Table.Td>
                  <Table.Td>{row.apiKey ?? '-'}</Table.Td>
                  <Table.Td>{row.secretKey ? '••••••' : '-'}</Table.Td>
                  <Table.Td>{row.clientId ?? '-'}</Table.Td>
                  <Table.Td>{row.clientSecret ? '••••••' : '-'}</Table.Td>
                  <Table.Td>{row.webhookUrl ?? '-'}</Table.Td>
                  <Table.Td>{row.webhookSecret ? '••••••' : '-'}</Table.Td>
                  <Table.Td>
                    <Badge color={row.isSandbox ? 'yellow' : 'blue'}>{row.isSandbox ? 'Sandbox' : 'Live'}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={row.isActive ? '#195EFE' : 'red'}>{row.isActive ? 'Active' : 'Inactive'}</Badge>
                  </Table.Td>
                  <Table.Td>{formatDateViVN(row.createdAt)}</Table.Td>
                  <Table.Td className='text-sm'>
                    <Group>
                      <UpdatePaymentButton id={row.id} />
                      <DeletePaymentButton id={row.id} />
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={13} className='bg-gray-100 text-center dark:bg-dark-card'>
                  <Text size='md' c='dimmed'>
                    Không có bản ghi phù hợp.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Box>

      <Group justify='space-between' align='center' my={'md'}>
        <PageSizeSelector />
        <CustomPagination totalPages={dataClient?.pagination.totalPages || 1} />
      </Group>
    </>
  );
}
