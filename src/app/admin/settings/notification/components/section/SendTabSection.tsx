'use client';

import { Badge, Box, Card, Group, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconUser, IconUsers } from '@tabler/icons-react';
import { Dispatch, SetStateAction } from 'react';
import BButton from '~/components/Button/Button';
import Empty from '~/components/Empty';
import { getTypeIcon, notificationPriorityInfo, notificationStatusInfo } from '../../helpers';
import { SendNotificationStateProps } from '../../NotificationManagement';
import { NotificationClient } from '../../types';

export const SendTabSection = ({
  setShowSendDialog,
  setActiveTab,
  notifications
}: {
  setShowSendDialog: Dispatch<SetStateAction<SendNotificationStateProps>>;
  setActiveTab: Dispatch<SetStateAction<string>>;
  notifications: NotificationClient[];
}) => {
  return (
    <>
      <SimpleGrid cols={2} m={0} p={0}>
        <Card
          withBorder
          radius={'lg'}
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
          radius={'lg'}
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

      <Card withBorder radius={'lg'}>
        <Stack>
          <Group justify='space-between'>
            <Box>
              <Text fw={700} size='xl'>
                Thông báo gần đây
              </Text>
              <Text size='sm'>Thông báo mới nhất của bạn đã gửi</Text>
            </Box>
            <BButton onClick={() => setActiveTab('history')} disabled={notifications?.length <= 5}>
              Xem thêm
            </BButton>
          </Group>
          <Box className='space-y-4'>
            {notifications?.length > 0 ? (
              notifications.slice(0, 5).map((notification: any) => {
                const priority =
                  notificationPriorityInfo?.[notification?.priority as 'low' | 'medium' | 'high' | 'urgent'];

                return (
                  <Paper
                    withBorder
                    radius={'lg'}
                    key={notification?.id}
                    className='flex items-center justify-between p-4'
                  >
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
                    <BButton
                      variant='outline'
                      onClick={() => setShowSendDialog({ open: true, typeAction: 'update', notification })}
                    >
                      Gửi lại
                    </BButton>
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
