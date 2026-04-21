'use client';

import { AreaChart } from '@mantine/charts';
import { Box, Card, Group, Select, Text } from '@mantine/core';
import { IconTrendingUp } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { api } from '~/trpc/react';

export function ActivityTimelineChart() {
  const [days, setDays] = useState('7');

  const { data, isLoading } = api.Activity.timeline.useQuery({ days: Number(days) }, { staleTime: 60000 });

  const chartData =
    data?.map(item => ({
      time: dayjs(item.time).format('MM/DD HH:mm'),
      count: item.count
    })) || [];

  const peak = Math.max(...chartData.map(d => d.count || 0), 0);
  const total = chartData.reduce((acc, d) => acc + d.count, 0);
  const avg = chartData.length ? Math.round(total / chartData.length) : 0;

  return (
    <Card className='shadow-lg' radius={'lg'}>
      <Group justify='space-between' mb='md'>
        <Group gap='xs'>
          <IconTrendingUp size={18} />
          <Text fw={600}>Dòng thời gian hoạt động</Text>
        </Group>

        <Select
          size='xs'
          radius={'md'}
          value={days}
          onChange={v => setDays(v || '7')}
          data={[
            { value: '7', label: '7 days' },
            { value: '14', label: '14 days' },
            { value: '30', label: '30 days' }
          ]}
        />
      </Group>

      <Box className='h-64'>
        <AreaChart
          data={chartData}
          dataKey='time'
          series={[
            {
              name: 'count',
              label: 'Activities',
              color: 'blue'
            }
          ]}
          withXAxis
          withYAxis={false}
          withDots={false}
          curveType='monotone'
          h={250}
        />
      </Box>

      <Group justify='space-between' mt='md'>
        <Box>
          <Text size='xs' c='dimmed'>
            Đỉnh điểm
          </Text>
          <Text fw={600}>{peak}</Text>
        </Box>

        <Box>
          <Text size='xs' c='dimmed'>
            Trung bình/giờ
          </Text>
          <Text fw={600}>{avg}</Text>
        </Box>

        <Box>
          <Text size='xs' c='dimmed'>
            Tổng
          </Text>
          <Text fw={600}>{total}</Text>
        </Box>
      </Group>
    </Card>
  );
}
