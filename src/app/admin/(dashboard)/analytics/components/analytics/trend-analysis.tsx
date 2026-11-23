'use client';

import { ActionIcon, Box, Group, Paper, SegmentedControl, Select, Text, Title, Tooltip } from '@mantine/core';
import { IconChartBar, IconChartLine, IconInfoCircle, IconZoomIn } from '@tabler/icons-react';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';
import { DailyMetric } from '~/shared/types/analysis.types';

interface TrendAnalysisProps {
  data: DailyMetric[];
  previousData: DailyMetric[];
  loading?: boolean;
}

export function TrendAnalysis({ data, previousData, loading }: TrendAnalysisProps) {
  const [metric, setMetric] = useState<'revenue' | 'orders' | 'newCustomers' | 'returningCustomers'>('revenue');
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  const [showCompare, setShowCompare] = useState(true);

  const chartData = data.slice(-30).map((item, idx) => {
    const prevItem = previousData[idx];
    return {
      date: item.date.slice(5),
      current:
        metric === 'revenue'
          ? item.revenue
          : metric === 'orders'
            ? item.orders
            : metric === 'newCustomers'
              ? item.newCustomers
              : item.returningCustomers,
      previous: prevItem
        ? metric === 'revenue'
          ? prevItem.revenue
          : metric === 'orders'
            ? prevItem.orders
            : metric === 'newCustomers'
              ? prevItem.newCustomers
              : prevItem.returningCustomers
        : null
    };
  });

  const titleMap = {
    revenue: 'Xu hướng doanh thu',
    orders: 'Orders Growth',
    newCustomers: 'Khách hàng mới',
    returningCustomers: 'Khách hàng quay lại'
  };
  const colorMap = { revenue: '#3b82f6', orders: '#10b981', newCustomers: '#8b5cf6', returningCustomers: '#f59e0b' };

  if (loading)
    return (
      <Paper p='md' withBorder h={400}>
        <Text>Loading trend data...</Text>
      </Paper>
    );

  return (
    <Paper p='md' withBorder>
      <Group justify='space-between' mb='lg' wrap='wrap'>
        <Box>
          <Group gap='xs'>
            <Title order={3}>{titleMap[metric]}</Title>
            <Tooltip label='Phân tích xu hướng theo ngày, so sánh với kỳ trước'>
              <IconInfoCircle size={18} style={{ opacity: 0.6, cursor: 'help' }} />
            </Tooltip>
          </Group>
          <Text size='sm' c='dimmed'>
            Theo dõi sự thay đổi và tăng trưởng qua thời gian
          </Text>
        </Box>
        <Group>
          <Select
            value={metric}
            onChange={val => setMetric(val as any)}
            data={[
              { value: 'revenue', label: 'Revenue' },
              { value: 'orders', label: 'Orders' },
              { value: 'newCustomers', label: 'Khách hàng mới' },
              { value: 'returningCustomers', label: 'Khách hàng quay lại' }
            ]}
            w={150}
          />
          <SegmentedControl
            value={chartType}
            onChange={val => setChartType(val as any)}
            data={[
              { value: 'area', label: <IconChartLine size={16} /> },
              { value: 'line', label: <IconChartBar size={16} /> }
            ]}
          />
          <ActionIcon variant={showCompare ? 'filled' : 'light'} onClick={() => setShowCompare(!showCompare)}>
            <IconZoomIn size={18} />
          </ActionIcon>
        </Group>
      </Group>
      <Box h={400}>
        <ResponsiveContainer width='100%' height='100%'>
          {chartType === 'area' ? (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='date' />
              <YAxis />
              <RechartsTooltip formatter={value => (typeof value === 'number' ? value.toLocaleString() : value)} />
              <Legend />
              <Area
                type='monotone'
                dataKey='current'
                stroke={colorMap[metric]}
                fill={colorMap[metric]}
                fillOpacity={0.2}
                name='Current Period'
              />
              {showCompare && (
                <Area
                  type='monotone'
                  dataKey='previous'
                  stroke='#94a3b8'
                  fill='#94a3b8'
                  fillOpacity={0.1}
                  name='Previous Period'
                />
              )}
            </AreaChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='date' />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Line type='monotone' dataKey='current' stroke={colorMap[metric]} strokeWidth={2} dot={false} />
              {showCompare && (
                <Line
                  type='monotone'
                  dataKey='previous'
                  stroke='#94a3b8'
                  strokeWidth={2}
                  strokeDasharray='5 5'
                  dot={false}
                />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
