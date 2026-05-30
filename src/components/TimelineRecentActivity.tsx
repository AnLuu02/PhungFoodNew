'use client';
import { Avatar, Badge, Box, Button, Divider, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import { formatTimeAgo } from '~/lib/FuncHandler/Format';
import { api } from '~/trpc/react';
import { CommonSkeleton } from './Loading/LoadingSkeleton';

export default function TimelineRecentActivity({
  initData,
  startTime,
  endTime
}: {
  initData?: any;
  startTime?: number;
  endTime?: number;
}) {
  const { data, isLoading } = api.Activity.feed.useQuery(
    {
      limit: 10,
      filters: {
        dateFrom: startTime ? new Date(+startTime) : undefined,
        dateTo: endTime ? new Date(+endTime) : undefined
      }
    },
    {
      ...(initData
        ? {
            initialData: initData
          }
        : {})
    }
  );
  const recentActivities = data?.items ?? [];

  return (
    <Paper withBorder radius='xl' className='overflow-hidden bg-white dark:bg-transparent'>
      <Box px='xl' py='lg'>
        <Group justify='space-between'>
          <Box>
            <Title order={4} className='font-quicksand'>
              Hoạt động gần đây
            </Title>
            <Text c='dimmed' size='sm'>
              Tổng quan các sự kiện mới nhất
            </Text>
          </Box>

          <Badge variant='light' radius='xl'>
            {recentActivities?.length || 0} hoạt động
          </Badge>
        </Group>
      </Box>

      <Divider />

      <Stack gap={8} p='md'>
        {isLoading ? (
          <CommonSkeleton.FeedList />
        ) : recentActivities?.length > 0 ? (
          recentActivities.slice(0, 5).map((item: any, index: number) => (
            <Paper
              key={index}
              withBorder
              radius='lg'
              p='sm'
              className='hover:p-md group cursor-pointer bg-gray-50 transition-all duration-200 hover:border-mainColor/60 hover:bg-white hover:shadow-sm dark:bg-dark-card'
            >
              <Group justify='space-between' wrap='nowrap' align='center'>
                <Group gap='sm' wrap='nowrap' className='min-w-0'>
                  <Avatar src={item?.user?.imageForEntity?.image?.url} radius='xl' size={36}>
                    {(item.user.name || item.user.email)?.charAt(0)}
                  </Avatar>

                  <Box className='min-w-0'>
                    <Text size='sm' fw={700} lineClamp={1}>
                      {item.user.name || item.user.email}
                    </Text>

                    <Text size='xs' c='dimmed' lineClamp={1}>
                      {formatTimeAgo(item?.createdAt)}
                    </Text>
                  </Box>
                </Group>

                <Badge
                  variant='light'
                  size='sm'
                  radius='xl'
                  className='shrink-0'
                  styles={{
                    root: {
                      textTransform: 'none',
                      maxWidth: 110
                    },
                    label: {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }
                  }}
                >
                  {item.entityId || 'Không rõ'}
                </Badge>
              </Group>

              <Box className='grid grid-rows-[0fr] transition-all duration-300 group-hover:grid-rows-[1fr] group-hover:delay-300'>
                <Box className='overflow-hidden'>
                  <Divider my='sm' />

                  <Stack gap={6}>
                    <Group justify='space-between' gap='xs'>
                      <Text size='xs' c='dimmed'>
                        Người thực hiện
                      </Text>
                      <Text size='xs' fw={600} lineClamp={1}>
                        {item.user.name || item.user.email}
                      </Text>
                    </Group>

                    <Group justify='space-between' gap='xs'>
                      <Text size='xs' c='dimmed'>
                        Đối tượng
                      </Text>
                      <Badge variant='light' size='xs' radius='xl' styles={{ root: { textTransform: 'none' } }}>
                        {item.entityId || 'Không rõ'}
                      </Badge>
                    </Group>

                    <Group justify='space-between' gap='xs'>
                      <Text size='xs' c='dimmed'>
                        Thời gian
                      </Text>
                      <Text size='xs' fw={600}>
                        {formatTimeAgo(item?.createdAt)}
                      </Text>
                    </Group>

                    <Text size='xs' c='dimmed' mt={4}>
                      Đã thực hiện hành động trên hệ thống.
                    </Text>
                  </Stack>
                </Box>
              </Box>
            </Paper>
          ))
        ) : (
          <Paper withBorder radius='lg' p='xl' style={{ borderStyle: 'dashed' }}>
            <Stack align='center' gap='xs'>
              <Text size='sm' c='dimmed' fw={500}>
                Chưa có hoạt động nào trong 7 ngày qua
              </Text>
            </Stack>
          </Paper>
        )}
      </Stack>

      <Box px='md' pb='md'>
        <Link href='/admin/activities' className='no-underline'>
          <Button fullWidth rightSection={<IconArrowRight size={16} />}>
            Xem tất cả hoạt động
          </Button>
        </Link>
      </Box>
    </Paper>
  );
}
