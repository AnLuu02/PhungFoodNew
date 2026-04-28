'use client';

import { Box, Group, Loader, Paper, Stack, Text } from '@mantine/core';
import { useInViewport } from '@mantine/hooks';
import { IconActivity, IconAlertCircle, IconCalendar } from '@tabler/icons-react';

import dayjs from 'dayjs';
import { useEffect } from 'react';
import { api } from '~/trpc/react';
import { ActivityFilters } from '../page';
import { ActivityItem } from './ActivityItem';
import ActivityItemSkeleton from './ActivityItemSkeleton';

export const ActivityFeed = ({
  filters,
  checkedList,
  onSeleted
}: {
  filters: ActivityFilters;
  checkedList: string[];
  onSeleted: (id: string, checked: boolean) => void;
}) => {
  const { ref, inViewport } = useInViewport();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = api.Activity.feed.useInfiniteQuery(
    {
      limit: 20,
      filters
    },
    {
      getNextPageParam: lastPage => lastPage.nextCursor
    }
  );
  useEffect(() => {
    if (inViewport && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inViewport]);

  if (isLoading)
    return (
      <Stack gap='lg'>
        {[1, 2, 3].map(item => (
          <ActivityItemSkeleton key={item} />
        ))}
      </Stack>
    );

  if (error)
    return (
      <Paper className='flex items-center gap-2 border border-red-200 bg-red-50 p-4 text-red-700'>
        <IconAlertCircle size={18} />
        {error.message}
      </Paper>
    );

  const logs = data?.pages.flatMap(p => p.items) || [];

  if (!logs.length)
    return (
      <Box className='py-12 text-center'>
        <IconActivity className='mx-auto mb-4 text-gray-300' size={40} />
        <Text c='dimmed'>Không tìm thấy hoạt động nào</Text>
      </Box>
    );

  const grouped = logs.reduce((acc: any, log: any) => {
    const key = dayjs(log.createdAt).format('YYYY-MM-DD');
    if (!acc[key]) acc[key] = [];
    acc[key].push(log);
    return acc;
  }, {});

  return (
    <Stack gap='lg'>
      {Object.entries(grouped).map(([date, items]: any) => (
        <Box key={date}>
          <Group gap='xs' mb='sm'>
            <IconCalendar size={16} />
            <Text size='sm' fw={600}>
              {dayjs(date).format('dddd, MMMM D, YYYY')}
            </Text>
          </Group>

          <Stack gap={4}>
            {items.map((log: any) => (
              <ActivityItem
                key={log.id}
                log={log}
                checked={checkedList.includes(log?.id)}
                onCheckboxChange={onSeleted}
              />
            ))}
          </Stack>
        </Box>
      ))}

      {hasNextPage && (
        <Box ref={ref} className='flex justify-center py-6'>
          <Loader size='sm' />
        </Box>
      )}
    </Stack>
  );
};
