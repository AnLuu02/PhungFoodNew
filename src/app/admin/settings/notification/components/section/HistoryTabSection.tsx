'use client';

import {
  Badge,
  Box,
  Card,
  Checkbox,
  Group,
  Paper,
  ScrollAreaAutosize,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconCalendar, IconEdit, IconEye, IconSearch, IconTrash, IconUser, IconUsers } from '@tabler/icons-react';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import BButton from '~/components/Button/Button';
import Empty from '~/components/Empty';
import { formatDateViVN } from '~/lib/FuncHandler/Format';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { api } from '~/trpc/react';
import { NotificationClientHasUser } from '~/types';
import { getTypeIcon, notificationPriorityInfo, notificationStatusInfo, notificationTypeOptions } from '../../helpers';
import { SendNotificationStateProps } from '../../NotificationManagement';

export const HistoryTabSection = ({
  notifications,
  setShowViewDialog,
  setShowSendDialog
}: {
  notifications: any[];
  setShowViewDialog: Dispatch<SetStateAction<{ open: boolean; notification?: NotificationClientHasUser }>>;
  setShowSendDialog: Dispatch<SetStateAction<SendNotificationStateProps>>;
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchQuery, 500);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const isSelectAll = useMemo(() => selectedNotifications?.length === notifications?.length, [selectedNotifications]);
  const utils = api.useUtils();
  const mutationDelete = api.Notification.delete.useMutation({
    onSuccess: () => {
      utils.Notification.invalidate();
      NotifySuccess('Thao tác thành công!');
      setLoading(false);
    },
    onError: e => {
      NotifyError(e.message);
      setLoading(false);
    }
  });

  const handleDeleteNotification = async (ids: string[]) => {
    setLoading(true);
    setSelectedNotifications([]);
    await mutationDelete.mutateAsync(ids);
  };

  const filterNotifications = useMemo(() => {
    return notifications.filter(notification => {
      const matchesSearch =
        notification.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        notification.message.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesStatus = filterStatus === 'all' || notification.status === filterStatus;
      const matchesType = filterType === 'all' || notification.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [notifications, debouncedSearch, filterStatus, filterType]);

  return (
    <>
      <Card withBorder radius={'lg'}>
        <Box className='flex flex-col gap-4 sm:flex-row'>
          <Box className='flex-1'>
            <Box className='relative'>
              <TextInput
                leftSection={<IconSearch className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform' />}
                placeholder='Search notifications...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.currentTarget.value)}
                radius={'md'}
              />
            </Box>
          </Box>
          <Select
            w={200}
            radius={'md'}
            placeholder='Select status'
            value={filterStatus}
            onChange={(value: any) => setFilterStatus(value || 'all')}
            data={[
              { value: 'all', label: 'Tất cả trạng thái' },
              { value: 'sent', label: 'Đã gửi' },
              { value: 'delivered', label: 'Đã chuyển' },
              { value: 'read', label: 'Đã đọc' },
              { value: 'scheduled', label: 'Đã lên lịch' },
              { value: 'failed', label: 'Lỗi!!!' }
            ]}
          />

          <Select
            w={150}
            radius={'md'}
            placeholder='Select type'
            value={filterType}
            onChange={(value: any) => setFilterType(value || 'all')}
            data={[
              { value: 'all', label: 'Tất cả kiểu' },
              ...Object.entries(notificationTypeOptions).map(([key, value]) => ({
                value: key,
                label: value.viName
              }))
            ]}
          />
        </Box>
      </Card>

      <Card withBorder radius={'lg'}>
        <Box className='flex flex-row items-center justify-between' mb={'md'}>
          <Box>
            <Text fw={700} size='xl'>
              Lịch sử thông báo ({filterNotifications?.length})
            </Text>
            <Text size='sm'>Tất cả các thông báo đã gửi và đã lên lịch</Text>
          </Box>
          <Group>
            {selectedNotifications?.length > 0 && (
              <BButton
                variant='outline'
                className='border-red-500 text-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white'
                onClick={() => {
                  handleDeleteNotification(selectedNotifications);
                }}
                loading={loading}
              >
                Xóa
              </BButton>
            )}
            <BButton
              variant='outline'
              onClick={() => {
                if (isSelectAll || selectedNotifications?.length > 0) {
                  setSelectedNotifications([]);
                } else {
                  setSelectedNotifications(notifications.map(n => n.id));
                }
              }}
            >
              {isSelectAll
                ? 'Bỏ chọn tất cả'
                : selectedNotifications?.length > 0
                  ? `Bỏ chọn ${selectedNotifications?.length}`
                  : 'Chọn tất cả'}
            </BButton>
          </Group>
        </Box>

        <ScrollAreaAutosize mah={1500} scrollbarSize={5}>
          <Box className='space-y-4' pr={'md'}>
            {filterNotifications?.length > 0 ? (
              filterNotifications.map((notification: any) => {
                const priories =
                  notificationPriorityInfo?.[notification?.priority as 'low' | 'medium' | 'high' | 'urgent'];
                const status =
                  notificationStatusInfo?.[notification?.status as 'draft' | 'scheduled' | 'sent' | 'delivered'];

                return (
                  <Paper withBorder radius={'lg'} key={notification?.id} className='space-y-3 p-4'>
                    <Box className='flex items-start justify-between'>
                      <Box className='flex items-start gap-3'>
                        {getTypeIcon(notification?.type)}
                        <Box className='flex-1'>
                          <Box className='mb-1 flex items-center gap-2'>
                            <h4 className='font-medium'>{notification?.title}</h4>
                            <Badge variant='outline' className={priories?.color}>
                              {priories?.viName}
                            </Badge>
                          </Box>
                          <Text className='mb-2 text-sm'>{notification?.message}</Text>
                          <Box className='flex items-center gap-4 text-xs'>
                            <span className='flex items-center gap-1'>
                              <IconCalendar className='h-3 w-3' />
                              {notification?.sentAt
                                ? formatDateViVN(notification?.sentAt)
                                : notification?.scheduledAt
                                  ? `Scheduled: ${formatDateViVN(notification?.scheduledAt)}`
                                  : formatDateViVN(notification?.createdAt)}
                            </span>
                            <span className='flex items-center gap-1'>
                              {notification?.recipient === 'all' ? (
                                <IconUsers className='h-3 w-3' />
                              ) : (
                                <IconUser className='h-3 w-3' />
                              )}
                              {notification?.recipient === 'all'
                                ? 'Tất cả người dùng'
                                : notification?.recipient === 'individual'
                                  ? notification?.recipients?.length + ' người dùng'
                                  : `Group: ${notification?.recipientDetails}`}
                            </span>
                          </Box>
                        </Box>
                      </Box>
                      <Box className='flex items-center gap-2'>
                        {status?.icon}
                        <Text fw={700} className='text-sm capitalize'>
                          {status?.viName}
                        </Text>
                      </Box>
                    </Box>

                    {notification?.status === 'sent' && (
                      <SimpleGrid cols={4} mt={'md'}>
                        {[
                          { key: 'sent', label: 'Đã gửi' },
                          { key: 'delivered', label: 'Đã nhận được' },
                          { key: 'read', label: 'Đã đọc' },
                          { key: 'clicked', label: 'Đã truy cập' }
                        ].map(({ key, label }) => (
                          <Paper
                            key={key + label}
                            withBorder
                            radius='md'
                            p='md'
                            className='flex items-center justify-center'
                          >
                            <Stack className='text-center' gap={4}>
                              <Text fw={700}>
                                {notification.analytics?.[key as 'sent' | 'delivered' | 'read' | 'clicked'] || 0}
                              </Text>
                              <Text c='dimmed' size='xs'>
                                {label}
                              </Text>
                            </Stack>
                          </Paper>
                        ))}
                      </SimpleGrid>
                    )}

                    {notification?.tags?.length > 0 && (
                      <Box className='flex gap-2 pt-2'>
                        {notification?.tags.map((tag: any, index: number) => (
                          <Badge
                            key={index}
                            classNames={{
                              root: 'bg-mainColor'
                            }}
                            radius={'md'}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </Box>
                    )}
                    <Box className='flex items-center justify-between'>
                      <Box className='flex items-center gap-2'>
                        <Checkbox
                          type='checkbox'
                          id={`notification-${notification?.id}`}
                          checked={selectedNotifications.includes(notification?.id)}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedNotifications((prev: any) => [...prev, notification?.id]);
                            } else {
                              setSelectedNotifications((prev: any) =>
                                prev.filter((id: any) => id !== notification?.id)
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={`notification-${notification?.id}`}
                          className='focus-visible:ring-ring peer-checked:bg-accent peer-checked:text-accent-foreground cursor-pointer rounded-md border px-3 py-1 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50'
                        >
                          Chọn
                        </label>
                      </Box>
                      <Box className='flex gap-2'>
                        <BButton
                          leftSection={<IconEye className='mr-1 h-4 w-4' />}
                          onClick={() => setShowViewDialog({ open: true, notification: notification })}
                        >
                          Xem
                        </BButton>
                        <BButton
                          leftSection={<IconEdit className='mr-1 h-4 w-4' />}
                          onClick={() =>
                            setShowSendDialog({ open: true, typeAction: 'update', notification: notification })
                          }
                        >
                          Chỉnh sửa
                        </BButton>
                        <BButton
                          className='bg-red-500'
                          loading={loading}
                          onClick={() => handleDeleteNotification([notification?.id])}
                          leftSection={<IconTrash className='mr-1 h-4 w-4' />}
                        >
                          Xóa
                        </BButton>
                      </Box>
                    </Box>
                  </Paper>
                );
              })
            ) : (
              <Empty title={'Không tìm thấy kết quả phù hợp./'} content='' hasButton={false} />
            )}
          </Box>
        </ScrollAreaAutosize>
      </Card>
    </>
  );
};
