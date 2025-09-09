'use client';

import { Avatar, Badge, Box, Group, Highlight, Spoiler, Table, Text, Tooltip } from '@mantine/core';
import PageSizeSelector from '~/components/Admin/Perpage';
import CustomPagination from '~/components/Pagination';
import { formatDateViVN, formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { LocalImageType, LocalProductStatus } from '~/lib/zod/EnumType';
import { DeleteProductButton, UpdateProductButton } from '../Button';

export default function TableProduct({ s, data, user }: { s: string; data: any; user?: any }) {
  const currentItems = data?.products || [];

  return (
    <>
      <Box className={`tableAdmin w-full overflow-x-auto`}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={100}>Tên</Table.Th>
              <Table.Th w={100}>Ảnh</Table.Th>
              <Table.Th w={100}>Giá tiền</Table.Th>
              <Table.Th w={400}>Mô tả</Table.Th>
              <Table.Th>Danh mục</Table.Th>
              <Table.Th>Trạng thái</Table.Th>
              <Table.Th>Ngày tạo</Table.Th>
              <Table.Th>Thao tác</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item: any) => (
                <Table.Tr key={item.id}>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {item.name}
                    </Highlight>
                  </Table.Td>

                  <Table.Td className='text-sm'>
                    <Avatar
                      src={item.images?.find((img: any) => img.type === LocalImageType.THUMBNAIL)?.url}
                      alt={item.name}
                      size={40}
                      radius='md'
                    />
                  </Table.Td>

                  <Table.Td className='text-sm'>{formatPriceLocaleVi(item.price)}</Table.Td>

                  <Table.Td className='text-sm'>
                    <Spoiler maxHeight={60} showLabel='Xem thêm' hideLabel='Ẩn'>
                      <Highlight size='sm' highlight={s}>
                        {item.description || 'Đang cập nhật.'}
                      </Highlight>
                    </Spoiler>
                  </Table.Td>

                  <Table.Td className='text-sm'>
                    <Tooltip label={item.subCategory?.name}>
                      <Badge color='green'>{item.subCategory?.name}</Badge>
                    </Tooltip>
                  </Table.Td>

                  <Table.Td className='text-sm'>
                    <Tooltip label={item.status}>
                      <Badge color={item.status === LocalProductStatus.ACTIVE ? '' : 'red'}>
                        {item.status === LocalProductStatus.ACTIVE ? 'Hiển thị' : 'Tạm ẩn'}
                      </Badge>
                    </Tooltip>
                  </Table.Td>

                  <Table.Td className='text-sm'> {formatDateViVN(item.createdAt)} </Table.Td>

                  <Table.Td className='text-sm'>
                    <Group>
                      <UpdateProductButton id={item.id} />
                      {(user?.user?.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN ||
                        user?.user?.role?.name === 'ADMIN') && <DeleteProductButton id={item.id} />}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={8} className='bg-gray-100 text-center'>
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
