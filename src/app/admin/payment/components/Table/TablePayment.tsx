'use client';

import { Box, Group, Table, Text } from '@mantine/core';
import PageSizeSelector from '~/components/Admin/Perpage';
import CustomPagination from '~/components/Pagination';
import { formatDateViVN } from '~/lib/func-handler/Format';
import { LocalPaymentType } from '~/lib/zod/EnumType';
import { DeletePaymentButton, UpdatePaymentButton } from '../Button';

export default function TablePayment({ s, data, user }: { s: string; data: any; user?: any }) {
  const currentItems = data?.payments || [];

  return (
    <>
      <Box className={`tableAdmin w-full overflow-x-auto`}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead className='rounded-lg text-sm uppercase leading-normal'>
            <Table.Tr>
              <Table.Th>Tên</Table.Th>
              <Table.Th>Hình thức</Table.Th>
              <Table.Th>Nhà cung cấp</Table.Th>
              <Table.Th>Phương thức mặc định</Table.Th>
              <Table.Th>Ngày tạo</Table.Th>
              <Table.Th>Thao tác</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item: any) => (
                <Table.Tr key={item.id}>
                  <Table.Td className='text-sm'>
                    <Text size='sm'>{item.name}</Text>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Text size='sm'>{item.type === LocalPaymentType.CREDIT_CARD ? 'Thẻ tín dụng' : 'Ví điện tử'}</Text>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Text size='sm'>{item.provider}</Text>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Text size='sm'>{item.isDefault ? 'Có' : 'Không'}</Text>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Text size='sm'>{formatDateViVN(item.createdAt)}</Text>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Group>
                      <UpdatePaymentButton id={item.id} />
                      {(user?.user?.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN ||
                        user?.user?.role?.name === 'ADMIN') && <DeletePaymentButton id={item.id} />}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={6} className='bg-gray-100 text-center'>
                  <Text size='md' c='dimmed'>
                    Không có bản ghi phù hợp.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Box>

      <Group justify='space-between' mt='md'>
        <PageSizeSelector />
        <CustomPagination totalPages={data?.pagination.totalPages || 1} />
      </Group>
    </>
  );
}
