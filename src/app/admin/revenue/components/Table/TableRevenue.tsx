'use client';

import { Box, Group, Table, Text } from '@mantine/core';
import SearchQueryParams from '~/components/Search/SearchQueryParams';
import { formatPriceLocaleVi } from '~/lib/func-handler/Format';

export default function TableRevenue({ revenues, s }: { revenues: any; s: string }) {
  const currentItems = revenues || [];

  const firstColumnTitle = s === 'user' ? 'Người dùng' : s === 'date' ? 'Ngày' : s === 'month' ? 'Tháng' : 'Năm';

  return (
    <>
      <Group pb='lg'>
        <Group justify='space-between' mt='md' w='100%'>
          <Text fw={500}>Số lượng bản ghi: {currentItems?.length || 0}</Text>
          <Group>
            <SearchQueryParams />
          </Group>
        </Group>
      </Group>

      <Box className={`tableAdmin w-full overflow-x-auto`}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead className='rounded-lg text-sm uppercase leading-normal'>
            <Table.Tr>
              <Table.Th>{firstColumnTitle}</Table.Th>
              <Table.Th>Tổng đơn hàng</Table.Th>
              <Table.Th>Tổng chi</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item: any, index: number) => (
                <Table.Tr key={index}>
                  <Table.Td className='text-sm'>
                    <Text size='sm'>
                      {s === 'user'
                        ? item.user?.name
                        : s === 'date'
                          ? `${item.date}/${item.month}/${item.year}`
                          : s === 'month'
                            ? `${item.month}/${item.year}`
                            : item.year}
                    </Text>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Text size='sm'>{item.totalOrders}</Text>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Text size='sm'>{formatPriceLocaleVi(item.totalSpent)}</Text>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={3} className='bg-gray-100 text-center'>
                  <Text size='md' c='dimmed'>
                    Không có bản ghi phù hợp.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Box>
    </>
  );
}
