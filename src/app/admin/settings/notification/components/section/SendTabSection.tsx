'use client';

import { Badge, Box, Button, Card, Group, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconUser, IconUsers } from '@tabler/icons-react';
import { Dispatch, SetStateAction } from 'react';
import Empty from '~/components/Empty';
import { NotificationClient } from '~/shared/schema/notification.schema';
import { getTypeIcon, notificationPriorityInfo, notificationStatusInfo } from '../../helpers';
import { SendNotificationStateProps } from '../../NotificationManagement';

export const SendTabSection = ({
  setShowSendDialog,
  changeTab,
  notifications
}: {
  setShowSendDialog: Dispatch<SetStateAction<SendNotificationStateProps>>;
  changeTab: (tab: string) => void;
  notifications: NotificationClient[];
}) => {
  return (
    <>
      <SimpleGrid cols={2} m={0} p={0}>
        <Card
          withBorder
          className='cursor-pointer transition duration-200 hover:scale-[1.01] hover:border-mainColor hover:shadow-md'
          onClick={() => setShowSendDialog({ open: true, typeAction: 'create', recipient: 'all' })}
        >
          <Box className='pb-3'>
            <Box className='flex items-center gap-2'>
              <IconUsers className='h-5 w-5 text-blue-500' />
              <Text className='text-lg' fw={700}>
                Gửi cho tất cả
              </Text>
            </Box>
          </Box>
          <Box>
            <Text className='text-sm'>Gửi thông báo đến tất cả khách hàng đã đăng ký</Text>
          </Box>
        </Card>

        <Card
          withBorder
          className='cursor-pointer transition duration-200 hover:scale-[1.01] hover:border-mainColor hover:shadow-md'
          onClick={() => setShowSendDialog({ open: true, typeAction: 'create', recipient: 'individual' })}
        >
          <Box className='pb-3'>
            <Box className='flex items-center gap-2'>
              <IconUser className='h-5 w-5 text-green-500' />
              <Text className='text-lg' fw={700}>
                Tin nhắn cá nhân
              </Text>
            </Box>
          </Box>
          <Box>
            <Text className='text-sm'>Gửi thông báo cá nhân đến khách hàng cụ thể</Text>
          </Box>
        </Card>
      </SimpleGrid>

      <Card withBorder>
        <Stack>
          <Group justify='space-between'>
            <Box>
              <Text fw={700} size='xl'>
                Thông báo gần đây
              </Text>
              <Text size='sm'>Thông báo mới nhất của bạn đã gửi</Text>
            </Box>
            <Button onClick={() => changeTab('history')} disabled={notifications?.length <= 5}>
              Xem thêm
            </Button>
          </Group>
          <Box className='space-y-4'>
            {notifications?.length > 0 ? (
              notifications.slice(0, 5).map((notification: any) => {
                const priority =
                  notificationPriorityInfo?.[notification?.priority as 'low' | 'medium' | 'high' | 'urgent'];

                return (
                  <Paper withBorder key={notification?.id} className='flex items-center justify-between p-4'>
                    <Box className='flex items-center gap-3'>
                      {getTypeIcon(notification?.type)}
                      <Box>
                        <Text className='font-bold'>{notification?.title}</Text>
                        <Text className='text-sm'>{notification?.message.slice(0, 60)}...</Text>
                      </Box>
                    </Box>
                    <Box className='flex items-center gap-2'>
                      {
                        notificationStatusInfo?.[
                          notification?.status as 'draft' | 'scheduled' | 'sent' | 'delivered' | 'read' | 'failed'
                        ]?.icon
                      }
                      <Badge variant='outline' className={priority?.color}>
                        {priority?.viName}
                      </Badge>
                    </Box>
                    <Button
                      variant='outline'
                      onClick={() => setShowSendDialog({ open: true, typeAction: 'update', notification })}
                    >
                      Gửi lại
                    </Button>
                  </Paper>
                );
              })
            ) : (
              <Empty title={'Gần đây chưa có thông báo gì'} content='' hasButton={false} />
            )}
          </Box>
        </Stack>
      </Card>
    </>
  );
};
