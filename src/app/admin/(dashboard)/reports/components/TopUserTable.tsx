'use client';

import { Card, Table, Text, Title } from '@mantine/core';
import { CommonSkeleton } from '~/components/Loading/LoadingSkeleton';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { api } from '~/trpc/react';
export const TopUserTable = ({ startTime, endTime }: { startTime?: number; endTime?: number }) => {
  const { data, isLoading } = api.Revenue.getTopUsers.useQuery({
    startTime,
    endTime,
    limit: 10
  });
  const topUsers = data || [];
  return (
    <Card withBorder shadow='sm'>
      <Title order={5} mb={'md'} className='font-quicksand'>
        Top khách hàng
      </Title>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Khách hàng</Table.Th>
            <Table.Th>Tổng chi</Table.Th>
            <Table.Th>Đơn hàng</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {isLoading ? (
            <Table.Tr>
              <Table.Td colSpan={3}>
                <CommonSkeleton.Table cols={3} />
              </Table.Td>
            </Table.Tr>
          ) : topUsers?.length > 0 ? (
            topUsers?.map((customer: any, index: number) => (
              <Table.Tr key={index}>
                <Table.Td>{customer?.user?.name || 'Đang cập nhật'}</Table.Td>
                <Table.Td>{formatPriceLocaleVi(Number(customer?.totalSpent || 0))}</Table.Td>
                <Table.Td>{customer?.totalOrders || 0}</Table.Td>
              </Table.Tr>
            ))
          ) : (
            <>
              <Table.Tr>
                <Table.Td colSpan={3} className='bg-gray-100 text-center dark:bg-dark-card'>
                  <Text size='md' c='dimmed'>
                    Hôm nay chưa có thanh toán nào được thực hiện./
                  </Text>
                </Table.Td>
              </Table.Tr>
            </>
          )}
        </Table.Tbody>
      </Table>
    </Card>
  );
};
