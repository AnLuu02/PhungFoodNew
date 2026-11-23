'use client';

import { ActionIcon, Group, Paper, SegmentedControl, Text, Title, Tooltip } from '@mantine/core';
import { IconDownload, IconInfoCircle } from '@tabler/icons-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';
import { RevenueBreakdown } from '~/shared/types/analysis.types';

interface RevenueAnalysisProps {
  data: RevenueBreakdown;
  loading?: boolean;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec489a'];

export function RevenueAnalysis({ data, loading }: RevenueAnalysisProps) {
  const [view, setView] = useState<'category' | 'product' | 'branch' | 'hour' | 'weekday'>('category');

  const renderChart = () => {
    switch (view) {
      case 'category':
        return (
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie data={data.byCategory} dataKey='value' nameKey='name' cx='50%' cy='50%' outerRadius={100} label>
                {data.byCategory.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip
                formatter={v =>
                  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v as number)
                }
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'product':
        return (
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={data.byProduct.slice(0, 6)} layout='vertical'>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis type='number' tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <YAxis type='category' dataKey='name' width={100} />
              <RechartsTooltip formatter={v => `$${v.toLocaleString()}`} />
              <Bar dataKey='revenue' fill='#3b82f6' />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'branch':
        return (
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={data.byBranch}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <RechartsTooltip formatter={v => `$${v.toLocaleString()}`} />
              <Bar dataKey='revenue' fill='#10b981' />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'hour':
        return (
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={data.byHour}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='hour' />
              <YAxis />
              <RechartsTooltip formatter={v => `$${v.toLocaleString()}`} />
              <Bar dataKey='revenue' fill='#f59e0b' />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return <Text>Select a view</Text>;
    }
  };

  if (loading)
    return (
      <Paper p='md' withBorder h={400}>
        <Text>Loading revenue data...</Text>
      </Paper>
    );

  return (
    <Paper p='md' withBorder>
      <Group justify='space-between' mb='lg'>
        <Group>
          <Title order={3}>Phân tích doanh thu</Title>
          <Tooltip label='Phân tích doanh thu theo danh mục, sản phẩm, chi nhánh, giờ và ngày'>
            <IconInfoCircle size={18} style={{ opacity: 0.6 }} />
          </Tooltip>
        </Group>
        <Group>
          <SegmentedControl
            value={view}
            onChange={val => setView(val as any)}
            data={[
              { value: 'category', label: 'By Category' },
              { value: 'product', label: 'By Product' },
              { value: 'branch', label: 'By Branch' },
              { value: 'hour', label: 'By Hour' }
            ]}
          />
          <ActionIcon variant='subtle'>
            <IconDownload size={18} />
          </ActionIcon>
        </Group>
      </Group>
      {renderChart()}
    </Paper>
  );
}
