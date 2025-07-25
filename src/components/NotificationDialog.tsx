'use client';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  Menu,
  Paper,
  ScrollAreaAutosize,
  Stack,
  Text,
  UnstyledButton
} from '@mantine/core';
import { IconBell, IconCheck, IconInfoCircle, IconTrash, IconTrashX, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { formatTimeAgo } from '~/lib/func-handler/formatDate';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { pusherClient } from '~/lib/pusher/client';
import { api } from '~/trpc/react';

declare global {
  interface Window {
    pusherClient?: typeof pusherClient;
  }
}

export default function NotificationDialog({ data, user }: any) {
  const notificationsData = data ?? [];
  const [notifications, setNotifications] = useState<any[]>([...notificationsData]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isNotify, setIsNotify] = useState(false);

  useEffect(() => {
    setNotifications([...notificationsData]);
  }, [notificationsData]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const deleteMutation = api.Notification.deleteFilter.useMutation();
  const deleteNotification = async (id: string) => {
    try {
      const res = await deleteMutation.mutateAsync({
        where: { id }
      });

      if (res.success) {
        setNotifications(notifications.filter(n => n.id !== id));
        setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        NotifySuccess('Thành công!', res.message);
      } else {
        NotifyError('Thất bại!', res.message || 'Không thể xóa thông báo.');
      }
    } catch (err) {
      NotifyError('Lỗi!', 'Đã xảy ra lỗi khi xóa thông báo.');
    }
  };

  const deleteSelected = async () => {
    try {
      const res = await deleteMutation.mutateAsync({
        where: {
          id: { in: selectedIds }
        }
      });

      if (res.success) {
        setNotifications(notifications.filter(n => !selectedIds.includes(n.id)));
        setSelectedIds([]);
        NotifySuccess('Thành công!', res.message);
      } else {
        NotifyError('Thất bại!', res.message || 'Không thể xóa các thông báo.');
      }
    } catch (err) {
      NotifyError('Lỗi!', 'Đã xảy ra lỗi khi xóa các thông báo.');
    }
  };

  const deleteAll = async (userId: string) => {
    try {
      const res = await deleteMutation.mutateAsync({
        where: {
          user: {
            some: { id: userId }
          }
        }
      });

      if (res.success) {
        setNotifications([]);
        setSelectedIds([]);
        NotifySuccess('Thành công!', res.message);
      } else {
        NotifyError('Thất bại!', res.message || 'Không thể xóa tất cả thông báo.');
      }
    } catch (err) {
      NotifyError('Lỗi!', 'Đã xảy ra lỗi khi xóa tất cả thông báo.');
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectAll = () => {
    if (selectedIds.length === notifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(notifications.map(n => n.id));
    }
  };

  useEffect(() => {
    window.pusherClient = pusherClient;

    const channel = pusherClient.subscribe(`user-${user?.email}`);
    channel.bind('new-notify', (data: any) => {
      setIsNotify(true);
      setNotifications([...notifications, data]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [user?.email]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (isNotify) {
      const timeout = setTimeout(() => {
        setIsNotify(false);
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [isNotify]);

  return (
    <Box pos={'fixed'} top={6} right={12} className='z-[9999] rounded-full' w={30} h={30} bg={'white'}>
      <div style={{ position: 'relative' }}>
        <Menu
          opened={isOpen}
          offset={-6}
          withArrow
          arrowPosition='center'
          arrowSize={12}
          onChange={setIsOpen}
          position='bottom-end'
          withOverlay
          overlayProps={{ opacity: 0.5 }}
          width={360}
          shadow='md'
          closeOnItemClick={false}
        >
          <Menu.Target>
            <Box variant='subtle' pos='relative' className='cursor-pointer'>
              <IconBell size={30} className='animate-wiggle text-black hover:text-subColor' />
              <Badge
                size='md'
                circle
                color='red'
                style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  padding: '0 4px',
                  minWidth: '18px'
                }}
              >
                {unreadCount}
              </Badge>
            </Box>
          </Menu.Target>

          <Menu.Dropdown p={0}>
            <Paper w='100%'>
              <Group justify='space-between' p='md'>
                <Text fw={600} size='md'>
                  Thông báo
                </Text>
                <Group gap='xs'>
                  {selectedIds.length > 0 && (
                    <Button color='red' size='xs' onClick={deleteSelected}>
                      Xóa ({selectedIds.length})
                    </Button>
                  )}
                  <Button
                    variant='subtle'
                    size='xs'
                    onClick={() => deleteAll(user?.id || '')}
                    disabled={notifications.length === 0}
                    leftSection={<IconTrashX size={16} />}
                  >
                    Xóa tất cả
                  </Button>
                </Group>
              </Group>

              <Divider />

              {notifications.length > 0 ? (
                <>
                  <Group p='xs' px='md'>
                    <Checkbox
                      checked={selectedIds.length === notifications.length && notifications.length > 0}
                      onChange={selectAll}
                      label='Chọn tất cả'
                      size='xs'
                    />
                    <Group ml='auto' gap='xs'>
                      <Badge color={unreadCount > 0 ? 'blue' : 'gray'} size='sm'>
                        {unreadCount} Chưa đọc
                      </Badge>
                      <Badge color='gray' variant='outline' size='sm'>
                        {notifications.length - unreadCount} Đã đọc
                      </Badge>
                    </Group>
                  </Group>

                  <Divider />

                  <ScrollAreaAutosize mah={300} scrollbarSize={8}>
                    <Stack gap={0} pr={8}>
                      {notifications.map(notification => (
                        <div key={notification.id}>
                          <UnstyledButton
                            w='100%'
                            onClick={() => markAsRead(notification.id)}
                            pos={'relative'}
                            p={'md'}
                            className='hover:bg-[rgba(0,0,0,0.2)] dark:bg-dark-card dark:text-dark-text dark:hover:bg-[rgba(255,255,255,0.2)]'
                          >
                            <Group align='flex-start' gap='md'>
                              <Checkbox
                                checked={selectedIds.includes(notification.id)}
                                onChange={event => {
                                  event.stopPropagation();
                                  toggleSelect(notification.id);
                                }}
                                size='xs'
                                mt={4}
                              />
                              <div style={{ flex: 1 }}>
                                <Group justify='space-between' wrap='nowrap'>
                                  <Text size='sm' fw={!notification.read ? 700 : 500}>
                                    {notification.title}
                                  </Text>
                                  <Group gap={4}>
                                    {!notification.read ? (
                                      <div
                                        style={{
                                          height: 8,
                                          width: 8,
                                          borderRadius: '50%',
                                          backgroundColor: 'var(--mantine-color-blue-6)'
                                        }}
                                      />
                                    ) : (
                                      <IconCheck size={16} color='var(--mantine-color-gray-6)' />
                                    )}
                                  </Group>
                                </Group>
                                <Text size='xs' c='dimmed' lineClamp={2}>
                                  {notification.message}
                                </Text>
                                <Text size='xs' c='dimmed' mt={4}>
                                  {formatTimeAgo(notification.createdAt)}
                                </Text>
                              </div>
                              <ActionIcon
                                variant='subtle'
                                color='gray'
                                size='sm'
                                onClick={e => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                              >
                                <IconTrash size={16} />
                              </ActionIcon>
                            </Group>
                          </UnstyledButton>
                          <Divider />
                        </div>
                      ))}
                    </Stack>
                  </ScrollAreaAutosize>
                </>
              ) : (
                <Text ta='center' c='dimmed' py='xl'>
                  Không có thông báo.
                </Text>
              )}
            </Paper>
          </Menu.Dropdown>
        </Menu>
      </div>
      {isNotify && (
        <Paper
          shadow='md'
          radius='md'
          onClick={() => setIsNotify(false)}
          p='sm'
          withBorder
          style={{
            position: 'fixed',
            top: '6%',
            right: 0,
            zIndex: 10000,
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            maxWidth: 520
          }}
        >
          <IconInfoCircle size={20} color='blue' />
          <Text size='sm' style={{ flex: 1 }}>
            Bạn có thông báo mới!
          </Text>
          <ActionIcon variant='light' size='sm'>
            <IconX size={14} />
          </ActionIcon>
        </Paper>
      )}
    </Box>
  );
}
