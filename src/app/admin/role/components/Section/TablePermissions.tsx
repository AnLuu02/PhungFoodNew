'use client';
import { Badge, Box, Flex, Group, Highlight, Table, Text } from '@mantine/core';
import PageSizeSelector from '~/components/Admin/Perpage';
import CustomPagination from '~/components/Pagination';
import { DeletePermissionButton, UpdatePermissionButton } from '../Button';

export default function TablePermission({ s, data }: { s: string; data: any }) {
  const currentItems = data?.permissions || [];

  return (
    <>
      <Box className={`tableAdmin w-full overflow-x-auto`}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead className='rounded-lg text-sm uppercase leading-normal'>
            <Table.Tr>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                ID
              </Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Quyền
              </Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Mô tả
              </Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Thuộc
              </Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Thao tác
              </Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {currentItems.length > 0 ? (
              currentItems.map((row: any, index: number) => (
                <Table.Tr key={index}>
                  <Table.Td className='text-sm'>{row.id}</Table.Td>
                  <Table.Td className='text-sm'>
                    <Highlight className='text-sm' highlight={s}>
                      {row.name}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Highlight className='text-sm' highlight={s}>
                      {row.description || 'Không có mô tả'}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Flex align={'center'} gap={5}>
                      {row?.roles?.map((item: any) => {
                        return (
                          <Badge bg={item.name === 'ADMIN' ? 'red' : item.name === 'CUSTOMER' ? 'green' : '#195EFE'}>
                            {item.viName}
                          </Badge>
                        );
                      })}
                    </Flex>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Group className='text-center'>
                      <>
                        <UpdatePermissionButton id={row.id} />
                        <DeletePermissionButton id={row.id} />
                      </>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={4} className='bg-gray-100 text-center dark:bg-dark-card'>
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
