'use client';

import { Card, Table, Text, Title } from '@mantine/core';
import { CommonSkeleton } from '~/components/Loading/LoadingSkeleton';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { api } from '~/trpc/react';
export const TopProductTable = ({ startTime, endTime }: { startTime?: number; endTime?: number }) => {
  const { data, isLoading } = api.Revenue.getTopProducts.useQuery({
    startTime,
    endTime
  });
  const topProducts = data || [];
  return (
    <Card withBorder shadow='sm'>
      <Title order={5} mb={'md'} className='font-quicksand'>
        Top sản phẩm
      </Title>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Tên</Table.Th>
            <Table.Th>Danh mục</Table.Th>
            <Table.Th>Giá</Table.Th>
            <Table.Th>Đã bán</Table.Th>
            <Table.Th>Tổng thu</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {isLoading ? (
            <Table.Tr>
              <Table.Td colSpan={5}>
                <CommonSkeleton.Table cols={5} />
              </Table.Td>
            </Table.Tr>
          ) : topProducts?.length > 0 ? (
            topProducts.map((product: any, index: number) => (
              <Table.Tr key={index}>
                <Table.Td>{product?.product?.name || 'Đang cập nhật'}</Table.Td>
                <Table.Td>{product?.product?.subCategory?.name || 'Đang cập nhật'}</Table.Td>
                <Table.Td>{formatPriceLocaleVi(product?.product?.price || 0)}</Table.Td>
                <Table.Td>{product?.soldQuantity || 0}</Table.Td>
                <Table.Td>{formatPriceLocaleVi(product?.profit || 0)}</Table.Td>
              </Table.Tr>
            ))
          ) : (
            <>
              <Table.Tr>
                <Table.Td colSpan={5} className='bg-gray-100 text-center dark:bg-dark-card'>
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
