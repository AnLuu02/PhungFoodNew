import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Timeline,
  TimelineItem,
  Title
} from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import { formatTimeAgo } from '~/lib/FuncHandler/Format';

export default function TimelineRecentActivity({ recentActivities }: { recentActivities: any }) {
  return (
    <Paper withBorder shadow='md' pb={'md'}>
      <Box px={'xl'} py={'md'}>
        <Title order={4} className='font-quicksand'>
          Hoạt động gần đây
        </Title>
        <Text c={'dimmed'} size='sm'>
          Các sự kiện mới đây trong hệ thống
        </Text>
      </Box>
      <Divider />
      <Stack gap='md' px='md' pb='md' mt='md'>
        {recentActivities?.length > 0 ? (
          <Timeline active={-1} bulletSize={38} lineWidth={2}>
            {recentActivities.slice(0, 5).map((item: any, index: number) => (
              <TimelineItem
                key={index}
                bullet={<Avatar src={item?.user?.imageForEntity?.image?.url} radius='xl' size={34} />}
              >
                <Paper p='xs' withBorder shadow='none' className='bg-gray-50 dark:bg-dark-background'>
                  <Group justify='space-between' align='flex-start' wrap='nowrap'>
                    <Stack gap={4}>
                      <Box size='sm' style={{ fontSize: '12px', lineHeight: 1.5 }}>
                        <Text size='sm' fw={700} component='span'>
                          {item.user.name || item.user.email}
                        </Text>

                        <Text size='sm' component='span' mx={4}>
                          đã thực hiện hành động trên
                        </Text>

                        <Badge
                          variant='light'
                          color='blue'
                          size='sm'
                          styles={{ root: { textTransform: 'none', verticalAlign: 'middle' } }}
                        >
                          {item.entityId || ''}
                        </Badge>
                      </Box>
                      <Text size='xs' c='dimmed'>
                        {formatTimeAgo(item?.createdAt)}
                      </Text>
                    </Stack>
                  </Group>
                </Paper>
              </TimelineItem>
            ))}
          </Timeline>
        ) : (
          <Paper withBorder p='xl' style={{ borderStyle: 'dashed' }}>
            <Stack align='center' gap='xs'>
              <Text size='sm' c='dimmed' fw={500}>
                Chưa có hoạt động nào trong 7 ngày qua
              </Text>
            </Stack>
          </Paper>
        )}
      </Stack>
      <Box px={'md'} ta={'end'}>
        <Link href={'/admin/activities'}>
          <Button variant='outline' rightSection={<IconArrowRight size={16} />}>
            Chi tiết
          </Button>
        </Link>
      </Box>
    </Paper>
  );
}
