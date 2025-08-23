'use client';

import { Badge, Box, Group, Highlight, Table, Text } from '@mantine/core';
import PageSizeSelector from '~/components/Admin/Perpage';
import CustomPagination from '~/components/Pagination';
import { DeleteReviewButton, UpdateReviewButton } from '../Button';

export default function TableReview({ s, data, user }: { s: string; data: any; user?: any }) {
  const currentItems = data?.reviews || [];

  return (
    <>
      <Box className={`tableAdmin w-full overflow-x-auto`}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Khách hàng</Table.Th>
              <Table.Th>Sản phẩm</Table.Th>
              <Table.Th>Đánh giá</Table.Th>
              <Table.Th>Bình luận</Table.Th>
              <Table.Th>Ngày tạo</Table.Th>
              <Table.Th>Thao tác</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item: any) => (
                <Table.Tr key={item.id}>
                  <Table.Td className='text-sm'>
                    <Text size='sm'>
                      <Highlight size='sm' highlight={s}>
                        {item.user?.name}
                      </Highlight>
                    </Text>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Text size='sm'>
                      <Highlight size='sm' highlight={s}>
                        {item.product?.name}
                      </Highlight>
                    </Text>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Badge color='blue'>{item.rating} ⭐</Badge>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Text size='sm'>
                      <Highlight size='sm' highlight={s}>
                        {item.comment}
                      </Highlight>
                    </Text>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Text size='sm'>{new Date(item.createdAt).toLocaleDateString()}</Text>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Group>
                      <UpdateReviewButton id={item.id} />
                      {(user?.user?.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN ||
                        user?.user?.role?.name === 'ADMIN') && <DeleteReviewButton id={item.id} />}
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
