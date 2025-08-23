'use client';
import { Box, Group, Highlight, Table, Text } from '@mantine/core';
import PageSizeSelector from '~/components/Admin/Perpage';
import CustomPagination from '~/components/Pagination';
import { DeleteRoleButton, UpdateRoleButton } from '../Button';

export default function TableRole({ s, data, user }: { s: string; data: any; user?: any }) {
  const currentItems = data?.roles || [];
  return (
    <>
      <Box className={`tableAdmin w-full overflow-x-auto`}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead className='rounded-lg text-sm uppercase leading-normal'>
            <Table.Tr>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Vai trò
              </Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Quyền
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
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {row.name}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>{row.permissions.map((p: any) => p.name).join(', ')}</Table.Td>
                  <Table.Td className='text-sm'>
                    <Group className='text-center'>
                      {user?.user && user.user.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN && (
                        <>
                          <UpdateRoleButton id={row.id} />
                          <DeleteRoleButton id={row.id} />
                        </>
                      )}
                    </Group>
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
      <Group justify='space-between' mt='md'>
        <PageSizeSelector />
        <CustomPagination totalPages={data?.pagination.totalPages || 1} />
      </Group>
    </>
  );
}
