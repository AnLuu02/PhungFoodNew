'use client';

import { Box, Group, Highlight, Table, Text, Tooltip } from '@mantine/core';
import PageSizeSelector from '~/components/Admin/Perpage';
import CustomPagination from '~/components/Pagination';
import { DeleteNotificationButton, UpdateNotificationButton } from '../Button';

export default function TableNotification({ data, s, user }: { s: string; data: any; user: any }) {
  const currentItems = data?.notifications || [];

  return (
    <>
      <Box className={`tableAdmin w-full overflow-x-auto`}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead className='rounded-lg text-sm uppercase leading-normal'>
            <Table.Tr>
              <Table.Th>Tiêu đề</Table.Th>
              <Table.Th>Nội dung</Table.Th>
              <Table.Th>Người nhận</Table.Th>
              <Table.Th>Ngày tạo</Table.Th>
              <Table.Th>Thao tác</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {currentItems.length > 0 ? (
              currentItems.map((notification: any) => (
                <Table.Tr key={notification.id}>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {notification.title}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {notification.message || 'Đang cập nhật.'}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    {notification.isSendToAll ? (
                      <Text fs='italic' c='blue'>
                        Tất cả người dùng
                      </Text>
                    ) : notification.user?.length > 0 ? (
                      notification.user.map((u: any) => u.name).join(', ').length > 30 ? (
                        <Tooltip label={notification.user.map((u: any) => u.name).join(', ')} withArrow>
                          <Text truncate>{notification.user.map((u: any) => u.name).join(', ')}</Text>
                        </Tooltip>
                      ) : (
                        <Text>{notification.user.map((u: any) => u.name).join(', ')}</Text>
                      )
                    ) : (
                      <Text color='gray'>Đang cập nhật.</Text>
                    )}
                  </Table.Td>
                  <Table.Td className='text-sm'>{new Date(notification.createdAt).toLocaleDateString()}</Table.Td>
                  <Table.Td className='text-sm'>
                    <Group>
                      {user?.user && (
                        <>
                          <UpdateNotificationButton id={notification.id} />
                          {(user.user.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN ||
                            user.user.role?.name === 'ADMIN') && <DeleteNotificationButton id={notification.id} />}
                        </>
                      )}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5} className='bg-gray-100 text-center'>
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
