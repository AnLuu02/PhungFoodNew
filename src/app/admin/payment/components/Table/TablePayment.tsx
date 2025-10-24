'use client';

import { Badge, Box, Group, Table, Text } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import PageSizeSelector from '~/components/Admin/Perpage';
import CustomPagination from '~/components/Pagination';
import { formatDateViVN } from '~/lib/func-handler/Format';
import { api } from '~/trpc/react';
import { DeletePaymentButton, UpdatePaymentButton } from '../Button';

export default function TablePayment({ s, data, allData }: { s: string; data: any; allData?: any }) {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '5';
  const { data: dataClient } = api.Payment.find.useQuery({ skip: +page, take: +limit, s }, { initialData: data });
  const currentItems = dataClient?.payments || [];

  return (
    <>
      <Box className={`tableAdmin w-full overflow-x-auto`}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead className='rounded-lg text-sm uppercase leading-normal'>
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
            {currentItems.length > 0 ? (
              currentItems.map((row: any) => (
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
        <CustomPagination totalPages={data?.pagination.totalPages || 1} />
      </Group>
    </>
  );
}
