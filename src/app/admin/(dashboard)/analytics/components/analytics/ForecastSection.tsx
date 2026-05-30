'use client';

import {
  ActionIcon,
  Badge,
  Box,
  Group,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Text,
  Title,
  Tooltip
} from '@mantine/core';
import { IconChartLine, IconDownload, IconInfoCircle } from '@tabler/icons-react';
import { useState } from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';
import { Forecast } from '~/shared/types/analysis.types';

interface ForecastSectionProps {
  forecast: Forecast;
  title: string;
  unit: 'currency' | 'number';
  loading?: boolean;
  error?: string;
}

export function ForecastSection({ forecast, title, unit, loading, error }: ForecastSectionProps) {
  const [showConfidence, setShowConfidence] = useState(true);

  if (loading)
    return (
      <Paper p='md' withBorder h={350}>
        <Text>Loading forecast...</Text>
      </Paper>
    );
  if (error)
    return (
      <Paper p='md' withBorder>
        <Text c='red'>Error: {error}</Text>
      </Paper>
    );

  const formatValue = (val: number | null) => {
    if (val === null) return 'N/A';
    if (unit === 'currency') return `$${val.toLocaleString()}`;
    return val.toLocaleString();
  };

  const chartData = forecast.dates.map((date, idx) => ({
    date,
    actual: forecast.actual[idx],
    forecast: forecast.forecast[idx],
    upper: forecast.upperBound[idx],
    lower: forecast.lowerBound[idx]
  }));

  const lastForecast = forecast.forecast[forecast.forecast.length - 1];
  const lastActual = forecast.actual.filter(v => v !== null).pop();

  return (
    <Paper p='md' withBorder>
      <Group justify='space-between' mb='md'>
        <Group>
          <IconChartLine size={24} />
          <Title order={3}>{title}</Title>
          <Tooltip label={`Dự báo với độ tin cậy ${forecast.confidence}%`}>
            <IconInfoCircle size={18} style={{ opacity: 0.6 }} />
          </Tooltip>
        </Group>
        <Group>
          <SegmentedControl
            size='xs'
            value={showConfidence ? 'confidence' : 'simple'}
            onChange={val => setShowConfidence(val === 'confidence')}
            data={[
              { value: 'confidence', label: 'With Confidence' },
              { value: 'simple', label: 'Simple' }
            ]}
          />
          <ActionIcon variant='subtle'>
            <IconDownload size={18} />
          </ActionIcon>
        </Group>
      </Group>

      <Box h={320}>
        <ResponsiveContainer width='100%' height='100%'>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' />
            <YAxis tickFormatter={v => (unit === 'currency' ? `$${(v / 1000).toFixed(0)}k` : v)} />
            <RechartsTooltip formatter={(value, name) => [formatValue(value as number), name]} />
            {showConfidence && (
              <Area type='monotone' dataKey='upper' stroke='none' fill='#93c5fd' fillOpacity={0.3} name='Upper Bound' />
            )}
            {showConfidence && (
              <Area type='monotone' dataKey='lower' stroke='none' fill='#93c5fd' fillOpacity={0.3} name='Lower Bound' />
            )}
            <Line type='monotone' dataKey='actual' stroke='#3B82F6' strokeWidth={2} dot={{ r: 3 }} name='Actual' />
            <Line
              type='monotone'
              dataKey='forecast'
              stroke='#F59E0B'
              strokeWidth={2}
              strokeDasharray='5 5'
              name='Forecast'
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>

      <SimpleGrid cols={2} spacing='md' mt='md'>
        <Paper withBorder p='sm'>
          <Text size='xs' c='dimmed'>
            Last Actual
          </Text>
          <Text fw={700}>{formatValue(lastActual || null)}</Text>
        </Paper>
        <Paper withBorder p='sm'>
          <Text size='xs' c='dimmed'>
            Forecast (end of period)
          </Text>
          <Text fw={700}>{formatValue(lastForecast || 0)}</Text>
          <Badge size='xs' color='blue'>
            Confidence: {forecast.confidence}%
          </Badge>
        </Paper>
      </SimpleGrid>
    </Paper>
  );
}
