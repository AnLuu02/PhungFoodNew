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
import { IconBell, IconCheck, IconTrash, IconTrashX } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { formatTimeAgo } from '~/app/lib/utils/func-handler/formatDate';
import { api } from '~/trpc/react';

export default function NotificationDialog() {
  const { data: user } = useSession();
  const { data, isLoading } = api.Notification.getFilter.useQuery({ s: user?.user?.email || '' });

  const notificationsData = data ?? [];
  const [notifications, setNotifications] = useState<any[]>([...notificationsData]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setNotifications([...notificationsData]);
  }, [notificationsData]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
  };

  const deleteSelected = () => {
    setNotifications(notifications.filter(n => !selectedIds.includes(n.id)));
    setSelectedIds([]);
  };

  const deleteAll = () => {
    setNotifications([]);
    setSelectedIds([]);
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

  return (
    <div style={{ position: 'relative' }}>
      <Menu
        opened={isOpen}
        offset={-6}
        withArrow
        arrowPosition='center'
        arrowSize={12}
        onChange={setIsOpen}
        position='bottom-end'
        width={360}
        shadow='md'
        closeOnItemClick={false}
      >
        <Menu.Target>
          <Box variant='subtle' pos='relative' className='cursor-pointer'>
            <IconBell size={30} className='animate-wiggle text-black hover:text-[#f8c144]' />
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

        {!isLoading && (
          <Menu.Dropdown p={0}>
            <Paper w='100%'>
              <Group justify='space-between' p='md'>
                <Text fw={600} size='md'>
                  Thông báo
                </Text>
                <Group gap='xs'>
                  {selectedIds.length > 0 && (
                    <Button color='red' size='xs' onClick={deleteSelected}>
                      Delete ({selectedIds.length})
                    </Button>
                  )}
                  <Button
                    variant='subtle'
                    size='xs'
                    onClick={deleteAll}
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
                            style={theme => ({
                              position: 'relative',
                              padding: theme.spacing.md,
                              backgroundColor: !notification.read ? theme.colors.gray[0] : undefined,
                              '&:hover': {
                                backgroundColor: theme.colors.gray[1]
                              }
                            })}
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
                                style={{
                                  position: 'absolute',
                                  top: 8,
                                  right: 8,
                                  opacity: 0,
                                  transition: 'opacity 0.2s',
                                  ':hover': {
                                    opacity: 1
                                  }
                                }}
                                className='notification-delete-btn'
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
        )}
      </Menu>

      <style jsx global>{`
        .notification-delete-btn {
          opacity: 0;
        }

        div:hover .notification-delete-btn {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
