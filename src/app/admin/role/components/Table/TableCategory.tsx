'use client';
import { Group, Highlight, Table, Text } from '@mantine/core';
import clsx from 'clsx';
import PageSizeSelector from '~/components/Admin/Perpage';
import CustomPagination from '~/components/Pagination';
import { DeleteRoleButton, UpdateRoleButton } from '../Button';

export default function TableRole({ s, data, user }: { s: string; data: any; user?: any }) {
  const currentItems = data?.roles || [];
  return (
    <>
      <div className={clsx('w-full overflow-x-auto', 'tableAdmin')}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead className='rounded-lg text-sm uppercase leading-normal'>
            <Table.Tr>
              <Table.Th style={{ minWidth: 100 }}>Vai trò</Table.Th>
              <Table.Th style={{ minWidth: 100 }}>Quyền</Table.Th>
              <Table.Th style={{ minWidth: 100 }}>Thao tác</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {currentItems.length > 0 ? (
              currentItems.map((row: any, index: number) => (
                <Table.Tr key={index}>
                  <Table.Td>
                    <Highlight highlight={s}>{row.name}</Highlight>
                  </Table.Td>
                  <Table.Td>{row.permissions.map((p: any) => p.name).join(', ')}</Table.Td>
                  <Table.Td>
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
      </div>
      <Group justify='space-between' mt='md'>
        <PageSizeSelector />
        <CustomPagination totalPages={data?.pagination.totalPages || 1} />
      </Group>
    </>
  );
}
