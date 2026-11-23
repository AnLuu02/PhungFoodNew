'use client';

import { ActionIcon, Badge, Box, Group, Paper, SimpleGrid, Text, Title, Tooltip } from '@mantine/core';
import {
  IconCancel,
  IconChefHat,
  IconClock,
  IconDownload,
  IconInfoCircle,
  IconReceiptRefund,
  IconTruck
} from '@tabler/icons-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';

interface OperationalMetrics {
  fulfillmentTime: { current: number; previous: number; unit: string };
  cancellationRate: { current: number; previous: number; unit: string };
  refundRate: { current: number; previous: number; unit: string };
  deliveryPerformance: { current: number; previous: number; unit: string };
  kitchenEfficiency: { current: number; previous: number; unit: string };
  peakHours: Array<{ hour: string; orderVolume: number; avgTime: number }>;
}

interface OperationalAnalyticsProps {
  metrics: OperationalMetrics;
  loading?: boolean;
  error?: string;
}

export function OperationalAnalytics({ metrics, loading, error }: OperationalAnalyticsProps) {
  if (loading)
    return (
      <Paper p='md' withBorder h={300}>
        <Text>Loading operational metrics...</Text>
      </Paper>
    );
  if (error)
    return (
      <Paper p='md' withBorder>
        <Text c='red'>Error: {error}</Text>
      </Paper>
    );

  const getTrend = (current: number, previous: number, lowerIsBetter: boolean = true) => {
    const diff = ((current - previous) / previous) * 100;
    const isGood = lowerIsBetter ? diff < 0 : diff > 0;
    return { diff: Math.abs(diff).toFixed(1), isGood, color: isGood ? 'green' : 'red' };
  };

  const fulfillmentTrend = getTrend(metrics.fulfillmentTime.current, metrics.fulfillmentTime.previous, true);
  const cancellationTrend = getTrend(metrics.cancellationRate.current, metrics.cancellationRate.previous, true);
  const refundTrend = getTrend(metrics.refundRate.current, metrics.refundRate.previous, true);
  const deliveryTrend = getTrend(metrics.deliveryPerformance.current, metrics.deliveryPerformance.previous, false);
  const kitchenTrend = getTrend(metrics.kitchenEfficiency.current, metrics.kitchenEfficiency.previous, false);

  const peakChartData = metrics.peakHours.map(p => ({ hour: p.hour, orders: p.orderVolume, avgTime: p.avgTime }));

  return (
    <Paper p='md' withBorder>
      <Group justify='space-between' mb='md'>
        <Group>
          <IconClock size={24} />
          <Title order={3}>Phân tích hoạt động</Title>
          <Tooltip label='Hiệu suất vận hành nhà hàng'>
            <IconInfoCircle size={18} style={{ opacity: 0.6 }} />
          </Tooltip>
        </Group>
        <ActionIcon variant='subtle'>
          <IconDownload size={18} />
        </ActionIcon>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing='md'>
        <Paper withBorder p='sm'>
          <Group gap='xs'>
            <IconClock size={18} />
            <Text size='sm' fw={500}>
              Fulfillment Time
            </Text>
          </Group>
          <Text size='h3'>
            {metrics.fulfillmentTime.current} {metrics.fulfillmentTime.unit}
          </Text>
          <Badge color={fulfillmentTrend.color}>
            {fulfillmentTrend.isGood ? '↓' : '↑'} {fulfillmentTrend.diff}%
          </Badge>
          <Text size='xs' c='dimmed'>
            so với kỳ trước
          </Text>
        </Paper>

        <Paper withBorder p='sm'>
          <Group gap='xs'>
            <IconCancel size={18} />
            <Text size='sm' fw={500}>
              Cancellation Rate
            </Text>
          </Group>
          <Text size='h3'>{metrics.cancellationRate.current}%</Text>
          <Badge color={cancellationTrend.color}>
            {cancellationTrend.isGood ? '↓' : '↑'} {cancellationTrend.diff}%
          </Badge>
          <Text size='xs' c='dimmed'>
            so với kỳ trước
          </Text>
        </Paper>

        <Paper withBorder p='sm'>
          <Group gap='xs'>
            <IconReceiptRefund size={18} />
            <Text size='sm' fw={500}>
              Refund Rate
            </Text>
          </Group>
          <Text size='h3'>{metrics.refundRate.current}%</Text>
          <Badge color={refundTrend.color}>
            {refundTrend.isGood ? '↓' : '↑'} {refundTrend.diff}%
          </Badge>
          <Text size='xs' c='dimmed'>
            so với kỳ trước
          </Text>
        </Paper>

        <Paper withBorder p='sm'>
          <Group gap='xs'>
            <IconTruck size={18} />
            <Text size='sm' fw={500}>
              Delivery Performance
            </Text>
          </Group>
          <Text size='h3'>{metrics.deliveryPerformance.current}%</Text>
          <Badge color={deliveryTrend.color}>
            {deliveryTrend.isGood ? '↑' : '↓'} {deliveryTrend.diff}%
          </Badge>
        </Paper>

        <Paper withBorder p='sm'>
          <Group gap='xs'>
            <IconChefHat size={18} />
            <Text size='sm' fw={500}>
              Kitchen Efficiency
            </Text>
          </Group>
          <Text size='h3'>{metrics.kitchenEfficiency.current}%</Text>
          <Badge color={kitchenTrend.color}>
            {kitchenTrend.isGood ? '↑' : '↓'} {kitchenTrend.diff}%
          </Badge>
        </Paper>
      </SimpleGrid>

      <Box mt='lg'>
        <Text fw={500} mb='xs'>
          Peak Hours Analysis
        </Text>
        <ResponsiveContainer width='100%' height={200}>
          <AreaChart data={peakChartData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='hour' />
            <YAxis yAxisId='left' />
            <YAxis yAxisId='right' orientation='right' />
            <RechartsTooltip />
            <Area
              type='monotone'
              dataKey='orders'
              stroke='#3B82F6'
              fill='#3B82F6'
              fillOpacity={0.2}
              yAxisId='left'
              name='Order Volume'
            />
            <Area
              type='monotone'
              dataKey='avgTime'
              stroke='#EF4444'
              fill='#EF4444'
              fillOpacity={0.2}
              yAxisId='right'
              name='Avg Time (min)'
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
