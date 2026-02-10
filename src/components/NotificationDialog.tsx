'use client';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Group,
  Menu,
  Paper,
  ScrollAreaAutosize,
  Stack,
  Text,
  UnstyledButton
} from '@mantine/core';
import { IconBell, IconCheck, IconInfoCircle, IconTrash, IconTrashX, IconX } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { ViewModal } from '~/app/admin/settings/notification/components/modal/ViewModal';
import { updateActionClient } from '~/app/admin/settings/notification/helpers';
import { formatTimeAgo } from '~/lib/FuncHandler/Format';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { pusherClient } from '~/lib/PusherConfig/client';
import { api } from '~/trpc/react';
import { NotificationClientHasUser, NotificationRecipientClientType } from '~/types';
import BButton from './Button/Button';
import { useRealtimeNotification } from './Hooks/use-realtime-notification';

declare global {
  interface Window {
    pusherClient?: typeof pusherClient;
  }
}

function NotificationDialog() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const { data, isLoading } = api.Notification.getByUser.useQuery(session?.user?.id || '', {
    enabled: !!session?.user?.id
  });
  const notificationsData = data?.data ?? [];
  const [notifications, setNotifications] = useState<NotificationClientHasUser[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isNotify, setIsNotify] = useState(false);
  const hasClicked = useRef(false);
  const [showViewDialog, setShowViewDialog] = useState<{
    open: boolean;
    notification: NotificationClientHasUser;
  }>({
    open: false,
    notification: {} as NotificationClientHasUser
  });
  const mutationUpdateAction = api.Notification.updateActionUser.useMutation({
    onError: error => {
      NotifyError('Thất bại!', error?.message);
    }
  });
  const deleteMutation = api.Notification.deleteFilter.useMutation({
    onSuccess: result => {
      NotifySuccess('Thao tác thành công!', result.message);
    },
    onError: error => {
      NotifyError('Thất bại!', error.message);
    }
  });

  const mutationSyncOffline = api.Notification.syncOffline.useMutation({
    onError: error => {
      NotifyError('Thất bại!', error?.message);
    }
  });
  const unreadCount = notifications.filter(n => !n?.recipients?.[0]?.clickedAt)?.length || 0;

  useRealtimeNotification({
    userId: session?.user?.id,
    onReceive: async (data: any) => {
      setIsNotify(true);
      setNotifications(prev => [...prev, data]);
      await updateActionClient({
        mutationUpdateAction,
        data,
        session,
        action: 'DELIVERED'
      });
    }
  });
  useEffect(() => {
    setNotifications([...(notificationsData as any)]);
  }, [notificationsData?.length]);

  useEffect(() => {
    if (isNotify) {
      const timeout = setTimeout(() => {
        setIsNotify(false);
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [isNotify]);
  useEffect(() => {
    (async () => {
      setLoading(true);
      const syncOfflineData = await mutationSyncOffline.mutateAsync({
        userId: session?.user?.id
      });
      if (syncOfflineData?.length) {
        setNotifications(prev => [...prev, ...(syncOfflineData as any)]);
        setLoading(false);
      }
    })();
  }, []);

  if (loading && isLoading) {
    return null;
  }

  return (
    <>
      <Box pos={'fixed'} top={6} right={12} className='z-[200] rounded-full' w={30} h={30} bg={'white'}>
        <Box style={{ position: 'relative' }}>
          <Menu
            radius={'md'}
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
                      <Button
                        color='red'
                        size='xs'
                        onClick={async () => {
                          try {
                            const res = await deleteMutation.mutateAsync({
                              where: {
                                id: { in: selectedIds }
                              }
                            });

                            if (res.code === 'OK') {
                              setNotifications(notifications.filter(n => !selectedIds.includes(n.id as string)));
                              setSelectedIds([]);
                              NotifySuccess('Thao tác thành công!', res.message);
                            } else {
                              NotifyError('Thất bại!', res.message || 'Không thể xóa các thông báo.');
                            }
                          } catch {
                            NotifyError('Đã có lỗi không mong muốn!', 'Đã xảy ra lỗi khi xóa các thông báo.');
                          }
                        }}
                      >
                        Xóa ({selectedIds.length})
                      </Button>
                    )}
                    <BButton
                      variant='subtle'
                      size='xs'
                      onClick={async () => {
                        try {
                          const res = await deleteMutation.mutateAsync({
                            where: {
                              user: {
                                some: { id: session?.user?.id }
                              }
                            }
                          });

                          if (res.code === 'OK') {
                            setNotifications([]);
                            setSelectedIds([]);
                            NotifySuccess('Thao tác thành công!', res.message);
                          } else {
                            NotifyError('Thất bại!', res.message || 'Không thể xóa tất cả thông báo.');
                          }
                        } catch {
                          NotifyError('Đã có lỗi không mong muốn!', 'Đã xảy ra lỗi khi xóa tất cả thông báo.');
                        }
                      }}
                      disabled={notifications.length === 0}
                      leftSection={<IconTrashX size={16} />}
                      className='text-mainColor hover:bg-mainColor/10 hover:text-mainColor'
                    >
                      Xóa tất cả
                    </BButton>
                  </Group>
                </Group>

                <Divider />

                {notifications.length > 0 ? (
                  <>
                    <Group p='xs' px='md'>
                      <Checkbox
                        checked={selectedIds.length === notifications.length && notifications.length > 0}
                        onChange={() => {
                          if (selectedIds.length === notifications.length) {
                            setSelectedIds([]);
                          } else {
                            setSelectedIds(notifications.map(n => n.id as string));
                          }
                        }}
                        label='Chọn tất cả'
                        size='xs'
                      />
                      <Group ml='auto' gap='xs'>
                        <Badge
                          classNames={{
                            root: `${unreadCount > 0 ? 'bg-mainColor text-white' : 'bg-gray-100 text-gray-500'}`
                          }}
                          size='sm'
                        >
                          {unreadCount} Chưa đọc
                        </Badge>
                        <Badge color='gray' variant='outline' size='sm'>
                          {notifications.length - unreadCount} Đã đọc
                        </Badge>
                      </Group>
                    </Group>

                    <Divider />

                    <ScrollAreaAutosize mah={300} scrollbarSize={8}>
                      <Stack gap={0}>
                        {notifications.map(notification => (
                          <Box key={notification.id}>
                            <UnstyledButton
                              w='100%'
                              onClick={async () => {
                                if (!notification?.recipients?.[0]?.clickedAt) {
                                  await updateActionClient({
                                    mutationUpdateAction,
                                    data: notification,
                                    session,
                                    action: 'CLICKED'
                                  });
                                  setNotifications(
                                    notifications.map(n =>
                                      n?.id === (notification.id as string)
                                        ? {
                                            ...n,
                                            analytics: { ...n?.analytics, clicked: n?.analytics?.CLICKED + 1 },
                                            recipients: [
                                              {
                                                ...n?.recipients?.[0],
                                                clickedAt: new Date()
                                              } as NotificationRecipientClientType
                                            ]
                                          }
                                        : n
                                    )
                                  );
                                }
                              }}
                              pos='relative'
                              p='md'
                              className='hover:bg-mainColor/10 dark:bg-dark-card dark:text-dark-text dark:hover:bg-[rgba(255,255,255,0.2)]'
                            >
                              <Group align='flex-start' gap='md'>
                                <Checkbox
                                  checked={selectedIds.includes(notification.id as string)}
                                  onChange={event => {
                                    event.stopPropagation();

                                    if (selectedIds.includes(notification.id as string)) {
                                      setSelectedIds(
                                        selectedIds.filter(selectedId => selectedId !== (notification.id as string))
                                      );
                                    } else {
                                      setSelectedIds([...selectedIds, notification.id as string]);
                                    }
                                  }}
                                  size='xs'
                                  mt={4}
                                />

                                <Box style={{ flex: 1, minWidth: 0 }}>
                                  <Group align='flex-start' justify='space-between' wrap='nowrap'>
                                    <Box style={{ flex: 1, minWidth: 0 }}>
                                      <Text
                                        size='sm'
                                        fw={!notification?.recipients?.[0]?.clickedAt ? 700 : 500}
                                        style={{
                                          display: '-webkit-box',
                                          WebkitLineClamp: 1,
                                          WebkitBoxOrient: 'vertical',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          wordBreak: 'break-word'
                                        }}
                                      >
                                        {notification.title}
                                      </Text>

                                      <Text
                                        size='xs'
                                        c='dimmed'
                                        style={{
                                          display: '-webkit-box',
                                          WebkitLineClamp: 1,
                                          WebkitBoxOrient: 'vertical',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          wordBreak: 'break-word'
                                        }}
                                      >
                                        {notification.message}
                                      </Text>
                                    </Box>

                                    <Group gap={4} flex='none'>
                                      {!notification?.recipients?.[0]?.clickedAt ? (
                                        <Box
                                          style={{
                                            height: 8,
                                            width: 8,
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--mantine-color-blue-6)',
                                            marginTop: 4
                                          }}
                                        />
                                      ) : (
                                        <IconCheck size={16} color='var(--mantine-color-gray-6)' />
                                      )}
                                    </Group>
                                  </Group>

                                  <Text size='xs' c='dimmed' mt={4}>
                                    {formatTimeAgo(
                                      notification?.recipients?.[0]?.deliveredAt || notification.createdAt
                                    )}
                                  </Text>
                                </Box>

                                <ActionIcon
                                  variant='subtle'
                                  color='gray'
                                  size='sm'
                                  loading={deleteMutation.isPending}
                                  onClick={async e => {
                                    e.stopPropagation();
                                    try {
                                      const res = await deleteMutation.mutateAsync({
                                        where: { id: notification?.recipients?.[0]?.id as string }
                                      });

                                      if (res.code === 'OK') {
                                        setNotifications(notifications.filter(n => n.id !== notification.id));
                                        setSelectedIds(selectedIds.filter(id => id !== notification.id));
                                        NotifySuccess('Thao tác thành công!', res.message);
                                      } else {
                                        NotifyError('Thất bại!', res.message || 'Không thể xóa thông báo.');
                                      }
                                    } catch {
                                      NotifyError('Đã có lỗi không mong muốn!', 'Đã xảy ra lỗi khi xóa thông báo.');
                                    }
                                  }}
                                >
                                  <IconTrash size={16} color='red' />
                                </ActionIcon>
                              </Group>

                              <Flex justify='flex-end'>
                                <BButton
                                  size='xs'
                                  onClick={async () => {
                                    setShowViewDialog({ open: true, notification });
                                    if (!notification?.recipients?.[0]?.readAt && !hasClicked.current) {
                                      hasClicked.current = true;
                                      await updateActionClient({
                                        mutationUpdateAction,
                                        data: notification,
                                        session,
                                        action: 'READ'
                                      });
                                    }
                                  }}
                                >
                                  Chi tiết
                                </BButton>
                              </Flex>
                            </UnstyledButton>

                            <Divider />
                          </Box>
                        ))}
                      </Stack>
                    </ScrollAreaAutosize>
                  </>
                ) : (
                  <Text ta='center' size='sm' className='italic' c='dimmed' py='lg'>
                    Không có thông báo.
                  </Text>
                )}
              </Paper>
            </Menu.Dropdown>
          </Menu>
        </Box>
        {isNotify && (
          <Paper
            shadow='md'
            radius='md'
            onClick={() => setIsNotify(false)}
            p='sm'
            withBorder
            className='fixed bottom-[20px] left-[20px] z-[10000] flex max-w-[520px] animate-fadeUp items-center gap-2 border-mainColor bg-mainColor text-white'
          >
            <IconInfoCircle size={20} className='text-blue dark:text-dark-text' />
            <Text size='sm' flex={1}>
              Bạn có thông báo mới!
            </Text>
            <ActionIcon
              variant='light'
              classNames={{
                root: `bg-mainColor/10 text-white`
              }}
              size='sm'
            >
              <IconX size={14} />
            </ActionIcon>
          </Paper>
        )}
      </Box>
      <ViewModal
        opened={showViewDialog.open}
        onClose={() => setShowViewDialog({ open: false, notification: {} as NotificationClientHasUser })}
        selectedNotification={showViewDialog.notification}
      />
    </>
  );
}

export default NotificationDialog;
