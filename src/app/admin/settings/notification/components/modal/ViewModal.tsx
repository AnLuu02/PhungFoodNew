'use client';
import {
  Badge,
  Box,
  Flex,
  Grid,
  Group,
  Modal,
  Paper,
  rem,
  ScrollAreaAutosize,
  Stack,
  Table,
  Text,
  Title,
  Tooltip
} from '@mantine/core';
import { useState } from 'react';
import BButton from '~/components/Button/Button';
import { NotificationClientHasUser } from '~/types';
import { notificationPriorityInfo, notificationStatusInfo, notificationTypeOptions } from '../../helpers';

interface ViewModalProps {
  opened: boolean;
  onClose: () => void;
  role?: 'client' | 'admin';
  selectedNotification?: NotificationClientHasUser;
}

export const ViewModal = ({ opened, onClose, selectedNotification, role = 'client' }: ViewModalProps) => {
  const [viewDetail, setViewDetail] = useState(false);

  const priority = notificationPriorityInfo?.[selectedNotification?.priority as 'low' | 'medium' | 'high' | 'urgent'];
  const status = notificationStatusInfo?.[selectedNotification?.status as 'draft' | 'scheduled' | 'sent' | 'delivered'];

  const isAdmin = role === 'admin';

  return (
    <Modal
      radius='lg'
      opened={opened}
      onClose={onClose}
      size='lg'
      transitionProps={{ duration: 200 }}
      zIndex={999999}
      classNames={{
        root: 'z-[999999] duration-200'
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
        <Stack gap='lg'>
          <Grid gutter={20}>
            <Grid.Col span={12}>
              <Text fw={500} size='sm'>
                Tiêu đề
              </Text>
              <Text c='dimmed' size='sm'>
                {selectedNotification.title}
              </Text>
            </Grid.Col>

            <Grid.Col span={12}>
              <Text fw={500} size='sm'>
                Nội dung
              </Text>
              <Text c='dimmed' size='sm' mt={4}>
                {selectedNotification.message}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text fw={500} size='sm'>
                Đã gửi:
              </Text>
              <Text c='dimmed' size='sm'>
                {`${new Date(selectedNotification.createdAt).toLocaleString('vi-VN') || new Date().toLocaleString('vi-VN')}`}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text fw={500} size='sm'>
                Loại
              </Text>
              <Badge color='blue' variant='light' ml={rem(8)}>
                {notificationTypeOptions?.[selectedNotification?.type].viName}
              </Badge>
            </Grid.Col>
            {isAdmin && (
              <>
                <Grid.Col span={6}>
                  <Text fw={500} size='sm'>
                    Độ ưu tiên
                  </Text>
                  <Badge variant='light' ml={rem(8)} classNames={{ root: priority?.color }}>
                    {priority.viName}
                  </Badge>
                </Grid.Col>

                <Grid.Col span={6}>
                  <Text fw={500} size='sm'>
                    Trạng thái
                  </Text>
                  <Group gap={4} mt={4}>
                    {status?.icon}
                    <Text size='sm' tt='capitalize' fw={700}>
                      {status.viName}
                    </Text>
                  </Group>
                </Grid.Col>
              </>
            )}
          </Grid>

          {isAdmin && (
            <>
              <Grid gutter={20}>
                <Grid.Col span={6}>
                  <Text fw={500} size='sm'>
                    Kênh
                  </Text>
                  <Group gap={4} mt={4}>
                    {selectedNotification.channels.map((ch: string) => (
                      <Badge key={ch} color='teal' variant='light' size='sm'>
                        {ch}
                      </Badge>
                    ))}
                  </Group>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text fw={500} size='sm'>
                    Người nhận
                  </Text>
                  <Group p={0} m={0} gap={4}>
                    <Text c='dimmed' size='sm'>
                      {selectedNotification.recipient === 'all'
                        ? 'Tất cả người dùng'
                        : selectedNotification?.recipients?.length + ' người dùng'}
                    </Text>
                    {selectedNotification.recipient !== 'all' && (
                      <BButton variant='subtle' size='xs' onClick={() => setViewDetail(!viewDetail)}>
                        Chi tiết
                      </BButton>
                    )}
                  </Group>
                </Grid.Col>
                <Grid.Col span={12}>
                  {selectedNotification.status === 'sent' && (
                    <Box>
                      <Text fw={500} size='sm'>
                        Phân tích
                      </Text>
                      <Paper withBorder radius='md' p='md' mt='sm'>
                        <Grid>
                          {[
                            { key: 'sent', label: 'Đã gửi' },
                            { key: 'delivered', label: 'Đã nhận được' },
                            { key: 'read', label: 'Đã đọc' },
                            { key: 'clicked', label: 'Đã truy cập' }
                          ].map(({ key, label }) => (
                            <Grid.Col span={3} key={key} ta='center'>
                              <Text fz='xl' fw={700}>
                                {selectedNotification.analytics?.[key as 'sent' | 'delivered' | 'read' | 'clicked'] ||
                                  0}
                              </Text>
                              <Text c='dimmed' fz='xs'>
                                {label}
                              </Text>
                            </Grid.Col>
                          ))}
                        </Grid>
                      </Paper>
                    </Box>
                  )}
                </Grid.Col>
              </Grid>

              {selectedNotification.tags?.length > 0 && (
                <Flex align={'center'} gap={'xs'}>
                  <Text fw={700} size='sm'>
                    Thẻ:
                  </Text>
                  <Group gap={4} mt={4}>
                    {selectedNotification.tags.map((tag: string, i: number) => (
                      <Badge key={i} color='gray' variant='light' size='sm'>
                        {tag}
                      </Badge>
                    ))}
                  </Group>
                </Flex>
              )}
            </>
          )}

          {isAdmin && viewDetail && (
            <Stack>
              <Group align='center' justify='space-between'>
                <Title order={5} className='font-quicksand'>
                  Danh sách người dùng
                </Title>
                <BButton size='xs' variant='outline' onClick={() => setViewDetail(false)}>
                  Ẩn
                </BButton>
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
          )}
        </Stack>
      ) : null}
    </Modal>
  );
};
