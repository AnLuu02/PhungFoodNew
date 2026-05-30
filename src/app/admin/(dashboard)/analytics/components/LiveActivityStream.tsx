'use client';

import { Badge, Box, Group, Paper, Text, ThemeIcon, Timeline, Title } from '@mantine/core';
import { IconActivity, IconAlertTriangle, IconFlame, IconShoppingCart, IconUsers } from '@tabler/icons-react';
const liveEvents = [
  {
    title: 'Khách đang checkout',
    desc: '12 người đang ở bước thanh toán',
    icon: IconShoppingCart,
    color: 'blue'
  },
  {
    title: 'Combo Gia Đình tăng mạnh',
    desc: 'Tăng 38% trong 2 giờ gần nhất',
    icon: IconFlame,
    color: 'orange'
  },
  {
    title: 'Lượng truy cập cao',
    desc: '132 người đang online',
    icon: IconUsers,
    color: 'green'
  },
  {
    title: 'Tỷ lệ huỷ đơn bất thường',
    desc: 'GrabFood tăng 7.8% so với trung bình',
    icon: IconAlertTriangle,
    color: 'red'
  }
];
export const LiveActivityStream = () => {
  return (
    <Paper withBorder radius='xl' p='lg' className='shadow-sm'>
      <Group justify='space-between' mb='md'>
        <Box>
          <Title order={4}>Hoạt động thời gian thực</Title>
          <Text size='sm' c='dimmed'>
            Sự kiện đang diễn ra trong hệ thống
          </Text>
        </Box>

        <Badge color='green' variant='light' leftSection={<IconActivity size={12} />}>
          Live
        </Badge>
      </Group>

      <Timeline active={4} bulletSize={34} lineWidth={2}>
        {liveEvents.map(event => {
          const Icon = event.icon;

          return (
            <Timeline.Item
              key={event.title}
              bullet={
                <ThemeIcon color={event.color} radius='xl' size={30}>
                  <Icon size={16} />
                </ThemeIcon>
              }
              title={
                <Text fw={700} size='sm'>
                  {event.title}
                </Text>
              }
            >
              <Text size='sm' c='dimmed'>
                {event.desc}
              </Text>
              <Text size='xs' c='dimmed' mt={4}>
                Vừa xong
              </Text>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </Paper>
  );
};
