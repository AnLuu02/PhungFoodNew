'use client';

import { Badge, Box, Group, Highlight, Table, Text } from '@mantine/core';
import PageSizeSelector from '~/components/Admin/Perpage';
import CustomPagination from '~/components/Pagination';
import { UserRole } from '~/constants';
import { formatDateViVN } from '~/lib/func-handler/Format';
import { DeleteUserButton, UpdateUserButton } from '../Button';

export default function TableUser({ s, data, user }: { s: string; data: any; user?: any }) {
  const currentItems = data?.users || [];

  return (
    <>
      <Box className={`tableAdmin w-full overflow-x-auto`}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Tên</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Vai trò</Table.Th>
              <Table.Th>Điện thoại</Table.Th>
              <Table.Th>Địa chỉ</Table.Th>
              <Table.Th>Ngày tạo</Table.Th>
              <Table.Th>Điểm</Table.Th>
              <Table.Th>Cấp điểm</Table.Th>
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
                    <Highlight size='sm' highlight={s}>
                      {item.email}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Badge
                      p='sm'
                      radius='md'
                      color={item.role?.name !== 'ADMIN' && item.role?.name !== 'Super Admin' ? 'green' : 'red'}
                    >
                      {item.role?.name || 'Super Admin'}
                    </Badge>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {item.phone}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {item.address?.fullAddress}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Text size='sm'>{formatDateViVN(item.createdAt)} </Text>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Text size='sm'>{item.pointUser}</Text>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Text size='sm'>{item.level}</Text>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Group>
                      {user?.user &&
                        (user.user.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN || user.user.role === 'ADMIN' ? (
                          <>
                            <UpdateUserButton email={item.email} />
                            {item.email !== process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN && (
                              <DeleteUserButton id={item.id} />
                            )}
                          </>
                        ) : user.user.role === UserRole.STAFF && user.user.email === item.email ? (
                          <UpdateUserButton email={item.email} />
                        ) : null)}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={9} className='bg-gray-100 text-center'>
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
