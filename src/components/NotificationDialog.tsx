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
  Text
} from '@mantine/core';
import { IconBell, IconCheck, IconInfoCircle, IconTrash, IconTrashX, IconX } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { ViewNotificationDetail } from '~/app/admin/settings/notification/components/modal/ViewNotificationDetail';
import { formatTimeAgo } from '~/lib/FuncHandler/Format';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { pusherClient } from '~/lib/PusherConfig/client';
import { NotificationBase } from '~/shared/type-trpc/notification.type-trpc';
import { api } from '~/trpc/react';
import { useRealtimeNotification } from './Hooks/use-realtime-notification';

declare global {
  interface Window {
    pusherClient?: typeof pusherClient;
  }
}

function NotificationDialog() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const userId = session?.user?.id;

  const { data, isLoading } = api.Notification.getNotificationsByUserWithRelationBase.useQuery(
    { userId: userId || '' },
    {
      enabled: !!userId
    }
  );
  const notifications = data ?? [];
  const [selectedIds, setSelectedIds] = useState<{ notificationId: string; recipientId: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isNotify, setIsNotify] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState<{
    open: boolean;
    notification: NotificationBase;
  }>({
    open: false,
    notification: {} as NotificationBase
  });

  const utils = api.useUtils();
  const mutationUpdateAction = api.Notification.updateActionUser.useMutation({
    onSuccess: () => {
      utils.Notification.getNotificationsByUserWithRelationBase.invalidate();
    }
  });
  const deleteMutation = api.Notification.deleteNotificationRecipient.useMutation({
    onMutate: async newTodo => {
      await utils.Notification.getNotificationsByUserWithRelationBase.cancel();
      const prevData = utils.Notification.getNotificationsByUserWithRelationBase.getData({ userId: userId || '' });

      utils.Notification.getNotificationsByUserWithRelationBase.setData({ userId: userId || '' }, oldData => {
        if (!oldData) return oldData;

        const recipientIds = new Set(newTodo.notifications.recipientIds);
        const newData = oldData.filter(i => !recipientIds.has(i.recipients?.[0]?.id as string));
        return newData;
      });
      return { prevData };
    },
    onSettled: () => {
      utils.Notification.getNotificationsByUserWithRelationBase.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });

  const mutationSyncOffline = api.Notification.syncOffline.useMutation({
    onSuccess: () => {
      utils.Notification.getNotificationsByUserWithRelationBase.invalidate();
      setLoading(false);
    }
  });
  const unreadCount = notifications.filter(n => !n?.recipients?.[0]?.clickedAt)?.length || 0;

  useRealtimeNotification({
    userId,
    onReceive: async (data: NotificationBase) => {
      setIsNotify(true);
      utils.Notification.getNotificationsByUserWithRelationBase.invalidate();
      await mutationUpdateAction.mutateAsync({
        notificationId: data.id,
        userId,
        action: 'delivered'
      });
    }
  });

  useEffect(() => {
    if (!userId) return;
    if (isNotify) {
      const timeout = setTimeout(() => {
        setIsNotify(false);
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [isNotify, userId?.toString()]);

  useEffect(() => {
    if (!userId) return;
    try {
      (async () => {
        setLoading(true);
        await mutationSyncOffline.mutateAsync({
          userId
        });
      })();
    } catch {
      throw new Error();
    } finally {
      setLoading(false);
    }
  }, [userId?.toString()]);

  const handleDeleteNotifications = async (notificationId?: string, recipientId?: string) => {
    try {
      if (notificationId && recipientId) {
        await deleteMutation.mutateAsync({
          notifications: {
            userId,
            ids: [notificationId],
            recipientIds: [recipientId]
          }
        });
        setSelectedIds(prev => prev.filter(n => n.recipientId !== recipientId));
      } else if (selectedIds.length > 0) {
        const { notificationIds, recipientIds } = selectedIds.reduce(
          (acc: { notificationIds: string[]; recipientIds: string[] }, item) => {
            acc.notificationIds.push(item.notificationId);
            acc.recipientIds.push(item.recipientId);
            return acc;
          },
          { notificationIds: [], recipientIds: [] }
        );
        await deleteMutation.mutateAsync({
          notifications: {
            userId,
            ids: notificationIds,
            recipientIds: recipientIds
          }
        });
        setSelectedIds([]);
      }

      NotifySuccess('Chúc mừng bạn đã thao tác thành công.', undefined, 'top-center');
    } catch (error) {
      console.error('Lỗi khi xóa thông báo:', error);
      NotifyError('Đã có lỗi xảy ra khi xóa thông báo. Vui lòng thử lại!', undefined, 'top-center');
    }
  };

  if (status === 'loading' || status === 'unauthenticated' || (loading && isLoading)) {
    return null;
  }

  return (
    <>
      <Box pos={'fixed'} top={6} right={12} className='z-[200] rounded-full' w={30} h={30} bg={'white'}>
        <Box style={{ position: 'relative' }}>
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
                  <Button
                    variant={'filled'}
                    color={selectedIds.length > 0 ? 'red' : undefined}
                    size='xs'
                    onClick={() => handleDeleteNotifications()}
                    disabled={notifications.length === 0 || selectedIds.length === 0}
                    leftSection={<IconTrashX size={16} />}
                  >
                    {selectedIds.length > 0 ? `Xóa (${selectedIds.length})` : 'Chọn để xóa'}
                  </Button>
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
                            setSelectedIds(
                              notifications.map(n => ({
                                notificationId: n.id,
                                recipientId: n?.recipients?.[0]?.id as string
                              }))
                            );
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
                        {notifications.map(notification => {
                          const recipient = notification?.recipients?.[0];
                          if (!recipient) return null;
                          return (
                            <Box key={notification.id}>
                              <Box
                                w='100%'
                                onClick={async () => {
                                  if (!recipient?.clickedAt) {
                                    await mutationUpdateAction.mutateAsync({
                                      notificationId: notification.id,
                                      userId,
                                      action: 'clicked'
                                    });
                                  }
                                }}
                                pos='relative'
                                p='md'
                                className='hover:bg-mainColor/10 dark:bg-dark-card dark:text-dark-text dark:hover:bg-[rgba(255,255,255,0.2)]'
                              >
                                <Group align='flex-start' gap='md'>
                                  <Checkbox
                                    checked={selectedIds.some(s => s.recipientId === (recipient?.id as string))}
                                    onChange={event => {
                                      event.stopPropagation();

                                      if (selectedIds.some(s => s.recipientId === (recipient?.id as string))) {
                                        setSelectedIds(prev =>
                                          prev.filter(
                                            selectedId => selectedId.recipientId !== (recipient?.id as string)
                                          )
                                        );
                                      } else {
                                        setSelectedIds(prev => [
                                          ...prev,
                                          {
                                            notificationId: notification.id,
                                            recipientId: recipient?.id as string
                                          }
                                        ]);
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
                                          fw={!recipient?.clickedAt ? 700 : 500}
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
                                        {!recipient?.clickedAt ? (
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
                                      {formatTimeAgo(recipient?.deliveredAt || notification.createdAt)}
                                    </Text>
                                  </Box>

                                  <ActionIcon
                                    variant='subtle'
                                    color='gray'
                                    size='sm'
                                    loading={deleteMutation.isPending}
                                    onClick={async e => {
                                      e.stopPropagation();
                                      handleDeleteNotifications(notification.id, recipient?.id);
                                    }}
                                  >
                                    <IconTrash size={16} color='red' />
                                  </ActionIcon>
                                </Group>

                                <Flex justify='flex-end'>
                                  <Button
                                    size='xs'
                                    onClick={async () => {
                                      setShowViewDialog({ open: true, notification });
                                      if (!recipient?.readAt) {
                                        await mutationUpdateAction.mutateAsync({
                                          notificationId: notification.id,
                                          userId,
                                          action: 'read'
                                        });
                                      }
                                    }}
                                  >
                                    Chi tiết
                                  </Button>
                                </Flex>
                              </Box>

                              <Divider />
                            </Box>
                          );
                        })}
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
      <ViewNotificationDetail
        opened={showViewDialog.open}
        onClose={() => setShowViewDialog({ open: false, notification: {} as NotificationBase })}
        selectedNotification={showViewDialog.notification}
      />
    </>
  );
}

export default NotificationDialog;
