'use client';

import { Avatar, Badge, Box, Group, Highlight, Table, Text } from '@mantine/core';
import PageSizeSelector from '~/components/Admin/Perpage';
import CustomPagination from '~/components/Pagination';
import { formatDateViVN } from '~/lib/func-handler/Format';
import { DeleteSubCategoryButton, UpdateSubCategoryButton } from '../Button';

export default function TableSubCategory({ s, data, user }: { s: string; data: any; user?: any }) {
  const currentItems = data?.subCategories || [];

  return (
    <>
      <Box className={`tableAdmin w-full overflow-x-auto`}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Tên</Table.Th>
              <Table.Th>Ảnh</Table.Th>
              <Table.Th>Thuộc loại</Table.Th>
              <Table.Th>Mô tả</Table.Th>
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
                    <Avatar src={item.image?.url} alt={item.image?.altText} size={40} radius='md' />
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {item.category?.name}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {item.description || 'Đang cập nhật.'}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Badge p='sm' radius='md' color={item.isActive ? '#195EFE' : 'red'}>
                      {item.isActive ? 'Hoạt động' : 'Bị cấm'}
                    </Badge>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Text size='sm'> {formatDateViVN(item.createdAt)} </Text>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Group>
                      <UpdateSubCategoryButton id={item.id} />
                      <DeleteSubCategoryButton id={item.id} />
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={6} className='bg-gray-100 text-center dark:bg-dark-card'>
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
