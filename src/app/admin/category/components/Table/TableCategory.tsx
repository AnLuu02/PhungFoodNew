'use client';
import { Badge, Box, Group, Highlight, Table, Text } from '@mantine/core';
import PageSizeSelector from '~/components/Admin/Perpage';
import CustomPagination from '~/components/Pagination';
import { formatDateViVN } from '~/lib/func-handler/Format';
import { DeleteCategoryButton, UpdateCategoryButton } from '../Button';

export default function TableCategory({ data, s, user }: { s: string; data: any; user: any }) {
  const currentItems = data?.categories || [];

  return (
    <>
      <Box className={`tableAdmin w-full overflow-x-auto`}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead className='rounded-lg text-sm uppercase leading-normal'>
            <Table.Tr>
              <Table.Th className='text-sm' style={{ width: 100 }}>
                Tên
              </Table.Th>
              <Table.Th className='text-sm' style={{ width: 200 }}>
                Mô tả
              </Table.Th>
              <Table.Th className='text-sm' style={{ width: 100 }}>
                Trạng thái
              </Table.Th>
              <Table.Th className='text-sm' style={{ width: 100 }}>
                Ngày tạo
              </Table.Th>
              <Table.Th className='text-sm' style={{ width: 100 }}>
                Thao tác
              </Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {currentItems.length > 0 ? (
              currentItems.map((row: any, index: number) => (
                <Table.Tr key={index}>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {row.name}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {row.description}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Badge p='sm' radius='md' color={row.isActive ? 'green' : 'red'}>
                      {row.isActive ? 'Hoạt động' : 'Bị cấm'}
                    </Badge>
                  </Table.Td>
                  <Table.Td className='text-sm'>{formatDateViVN(row.createdAt)}</Table.Td>
                  <Table.Td className='text-sm'>
                    <Group>
                      <Group>
                        <UpdateCategoryButton id={row.id} />
                        <DeleteCategoryButton id={row.id} />
                      </Group>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={3} className='bg-gray-100 text-center dark:bg-dark-card'>
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
