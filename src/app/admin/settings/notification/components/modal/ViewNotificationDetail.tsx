'use client';
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Group,
  Modal,
  Paper,
  ScrollAreaAutosize,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
  Tooltip
} from '@mantine/core';
import { NotificationType } from '@prisma/client';
import { IconArrowUpRight, IconCheck, IconMail, IconSend, IconTag, IconUsers } from '@tabler/icons-react';
import { useState } from 'react';
import { NotificationBase } from '~/shared/type-trpc/notification.type-trpc';
import { notificationPriorityInfo, notificationStatusInfo, notificationTypeOptions } from '../../helpers';

interface ViewNotificationDetailProps {
  opened: boolean;
  onClose: () => void;
  role?: 'client' | 'admin';
  selectedNotification?: NotificationBase;
}

export const ViewNotificationDetail = ({
  opened,
  onClose,
  selectedNotification,
  role = 'client'
}: ViewNotificationDetailProps) => {
  const [viewDetail, setViewDetail] = useState(false);

  const priority = notificationPriorityInfo?.[selectedNotification?.priority as 'low' | 'medium' | 'high' | 'urgent'];
  const status = notificationStatusInfo?.[selectedNotification?.status as 'draft' | 'scheduled' | 'sent' | 'delivered'];

  const isAdmin = role === 'admin';

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size='lg'
      transitionProps={{ duration: 200 }}
      zIndex={999999}
      classNames={{
        root: 'z-[999999] duration-200',
        title: 'font-quicksand text-xl font-bold'
      }}
      title={
        <Group>
          <Title order={2} className='font-quicksand'>
            Chi tiết thông báo
          </Title>
        </Group>
      }
    >
      {opened && selectedNotification ? (
        <Stack gap='md' className='pt-2'>
          {/* Thông tin chính */}
          <Card padding='lg' radius='md' withBorder className='shadow-sm'>
            <Stack gap='md'>
              <Box>
                <Text fw={600} size='sm' className='text-gray-500'>
                  Tiêu đề
                </Text>
                <Text size='md' fw={700} mt={2}>
                  {selectedNotification.title}
                </Text>
              </Box>

              <Box>
                <Text fw={600} size='sm' className='text-gray-500'>
                  Nội dung
                </Text>
                <Text size='sm' mt={2} className='whitespace-pre-wrap'>
                  {selectedNotification.message}
                </Text>
              </Box>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='md'>
                <Box>
                  <Text fw={600} size='sm' className='text-gray-500'>
                    Đã gửi
                  </Text>
                  <Text size='sm' mt={2}>
                    {new Date(selectedNotification.createdAt).toLocaleString('vi-VN')}
                  </Text>
                </Box>
                <Box>
                  <Text fw={600} size='sm' className='text-gray-500'>
                    Loại
                  </Text>
                  <Badge color='blue' variant='light' mt={4}>
                    {notificationTypeOptions?.[selectedNotification?.type as NotificationType].viName}
                  </Badge>
                </Box>
                {isAdmin && (
                  <>
                    <Box>
                      <Text fw={600} size='sm' className='text-gray-500'>
                        Độ ưu tiên
                      </Text>
                      <Badge variant='light' mt={4} classNames={{ root: priority?.color }}>
                        {priority.viName}
                      </Badge>
                    </Box>
                    <Box>
                      <Text fw={600} size='sm' className='text-gray-500'>
                        Trạng thái
                      </Text>
                      <Group gap={6} mt={4}>
                        {status?.icon}
                        <Text size='sm' tt='capitalize' fw={700}>
                          {status.viName}
                        </Text>
                      </Group>
                    </Box>
                  </>
                )}
              </SimpleGrid>
            </Stack>
          </Card>

          {/* Thông tin admin chi tiết */}
          {isAdmin && (
            <Card padding='lg' radius='md' withBorder className='shadow-sm'>
              <Stack gap='md'>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='md'>
                  <Box>
                    <Text fw={600} size='sm' className='text-gray-500'>
                      Kênh
                    </Text>
                    <Group gap={6} mt={4}>
                      {selectedNotification.channels.map((ch: string) => (
                        <Badge key={ch} color='teal' variant='light' size='sm'>
                          {ch}
                        </Badge>
                      ))}
                    </Group>
                  </Box>
                  <Box>
                    <Text fw={600} size='sm' className='text-gray-500'>
                      Người nhận
                    </Text>
                    <Group gap={6} mt={4}>
                      <Text size='sm' c='dimmed'>
                        {selectedNotification.recipient === 'all'
                          ? 'Tất cả người dùng'
                          : `${selectedNotification?.recipients?.length} người dùng`}
                      </Text>
                      {selectedNotification.recipient !== 'all' && (
                        <Button
                          variant='subtle'
                          size='xs'
                          onClick={() => setViewDetail(!viewDetail)}
                          leftSection={viewDetail ? <IconArrowUpRight size={14} /> : <IconUsers size={14} />}
                        >
                          {viewDetail ? 'Ẩn chi tiết' : 'Chi tiết'}
                        </Button>
                      )}
                    </Group>
                  </Box>
                </SimpleGrid>

                {/* Phân tích nếu đã gửi */}
                {selectedNotification.status === 'sent' && (
                  <Box>
                    <Text fw={600} size='sm' className='mb-2 text-gray-500'>
                      Phân tích
                    </Text>
                    <Paper withBorder p='md' radius='md' className='bg-gray-50'>
                      <SimpleGrid cols={4} spacing='xs'>
                        {[
                          { key: 'sent', label: 'Đã gửi', icon: <IconSend size={16} /> },
                          { key: 'delivered', label: 'Đã nhận', icon: <IconCheck size={16} /> },
                          { key: 'read', label: 'Đã đọc', icon: <IconMail size={16} /> },
                          { key: 'clicked', label: 'Đã truy cập', icon: <IconArrowUpRight size={16} /> }
                        ].map(({ key, label, icon }) => (
                          <Box key={key} ta='center' className='py-1'>
                            <Group justify='center' gap={4} mb={2}>
                              {icon}
                              <Text fz='lg' fw={700}>
                                {(selectedNotification.analytics as any)?.[key] ?? 0}
                              </Text>
                            </Group>
                            <Text c='dimmed' fz='xs'>
                              {label}
                            </Text>
                          </Box>
                        ))}
                      </SimpleGrid>
                    </Paper>
                  </Box>
                )}

                {/* Tags */}
                {selectedNotification.tags?.length > 0 && (
                  <Flex align='center' gap='xs'>
                    <IconTag size={16} className='text-gray-500' />
                    <Text fw={600} size='sm' className='text-gray-500'>
                      Thẻ:
                    </Text>
                    <Group gap={4}>
                      {selectedNotification.tags.map((tag: string, i: number) => (
                        <Badge key={i} color='gray' variant='light' size='sm'>
                          {tag}
                        </Badge>
                      ))}
                    </Group>
                  </Flex>
                )}
              </Stack>
            </Card>
          )}

          {/* Danh sách người dùng chi tiết */}
          {isAdmin && viewDetail && (
            <Card padding='lg' radius='md' withBorder className='shadow-sm'>
              <Stack gap='md'>
                <Group justify='space-between' align='center'>
                  <Title order={5} className='font-quicksand'>
                    Danh sách người dùng
                  </Title>
                  <Button size='xs' variant='outline' onClick={() => setViewDetail(false)}>
                    Ẩn
                  </Button>
                </Group>
                <ScrollAreaAutosize scrollbarSize={5} mah={200}>
                  <Table striped highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Mã người dùng</Table.Th>
                        <Table.Th>Email</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {selectedNotification?.recipients?.map((recipient: any) => (
                        <Table.Tr key={recipient?.user?.id || recipient?.id}>
                          <Table.Td>
                            <Tooltip label={recipient?.user?.id || 'Đang cập nhật'} withArrow>
                              <span className='block cursor-help truncate font-medium text-blue-600'>
                                {recipient?.user?.id || 'Đang cập nhật'}
                              </span>
                            </Tooltip>
                          </Table.Td>
                          <Table.Td className='text-sm'>{recipient?.user?.email || 'Không có email'}</Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollAreaAutosize>
              </Stack>
            </Card>
          )}
        </Stack>
      ) : null}
    </Modal>
  );
};
