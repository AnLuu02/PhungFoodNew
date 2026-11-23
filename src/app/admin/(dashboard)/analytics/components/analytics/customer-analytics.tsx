'use client';

import {
  ActionIcon,
  Box,
  Group,
  Paper,
  Progress,
  RingProgress,
  SimpleGrid,
  Table,
  Text,
  Title,
  Tooltip
} from '@mantine/core';
import { IconDownload, IconInfoCircle, IconUsers } from '@tabler/icons-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';
import { CustomerSegment } from '~/shared/types/analysis.types';

interface CustomerAnalyticsProps {
  segments: CustomerSegment[];
  topCustomers: Array<{ name: string; orders: number; totalSpent: number }>;
  retentionRate: number;
  repeatRate: number;
  loading?: boolean;
  error?: string;
}

const COLORS = ['#F59E0B', '#10B981', '#3B82F6', '#EF4444'];

export function CustomerAnalytics({
  segments,
  topCustomers,
  retentionRate,
  repeatRate,
  loading,
  error
}: CustomerAnalyticsProps) {
  if (loading) {
    return (
      <Paper p='md' withBorder h={400}>
        <Text>Loading Phân tích khách hàng...</Text>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper p='md' withBorder>
        <Text c='red'>Error: {error}</Text>
      </Paper>
    );
  }

  const pieData = segments.map(s => ({ name: s.name, value: s.revenue }));
  const segmentCountData = segments.map(s => ({ name: s.name, count: s.count }));

  return (
    <Paper p='md' withBorder>
      <Group justify='space-between' mb='md'>
        <Group>
          <IconUsers size={24} />
          <Title order={3}>Phân tích khách hàng</Title>
          <Tooltip label='Phân tích hành vi khách hàng, phân khúc và vòng đời'>
            <IconInfoCircle size={18} style={{ opacity: 0.6, cursor: 'help' }} />
          </Tooltip>
        </Group>
        <ActionIcon variant='subtle'>
          <IconDownload size={18} />
        </ActionIcon>
      </Group>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing='lg'>
        <Box>
          <Text size='sm' fw={500} mb='xs'>
            Revenue by Segment
          </Text>
          <ResponsiveContainer width='100%' height={200}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey='value'
                nameKey='name'
                cx='50%'
                cy='50%'
                outerRadius={70}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip formatter={v => `$${(v as number).toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Box>
          <Text size='sm' fw={500} mb='xs'>
            Customer Count by Segment
          </Text>
          <ResponsiveContainer width='100%' height={200}>
            <BarChart data={segmentCountData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey='count' fill='#3B82F6' />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='md' mt='md'>
        <Paper withBorder p='sm'>
          <Group justify='space-between'>
            <Text size='sm' c='dimmed'>
              Giữ chân khách hàng Rate
            </Text>
            <Tooltip label='Tỷ lệ khách hàng quay lại sau lần đầu'>
              <IconInfoCircle size={14} />
            </Tooltip>
          </Group>
          <RingProgress
            size={100}
            thickness={8}
            roundCaps
            sections={[{ value: retentionRate, color: 'teal' }]}
            label={
              <Text size='xl' fw={700} ta='center'>
                {retentionRate}%
              </Text>
            }
          />
          <Progress value={retentionRate} size='sm' color='teal' mt='xs' />
        </Paper>

        <Paper withBorder p='sm'>
          <Group justify='space-between'>
            <Text size='sm' c='dimmed'>
              Repeat Purchase Rate
            </Text>
            <Tooltip label='Tỷ lệ khách hàng mua từ 2 lần trở lên'>
              <IconInfoCircle size={14} />
            </Tooltip>
          </Group>
          <RingProgress
            size={100}
            thickness={8}
            roundCaps
            sections={[{ value: repeatRate, color: 'blue' }]}
            label={
              <Text size='xl' fw={700} ta='center'>
                {repeatRate}%
              </Text>
            }
          />
          <Progress value={repeatRate} size='sm' color='blue' mt='xs' />
        </Paper>
      </SimpleGrid>

      {topCustomers.length > 0 && (
        <>
          <Text fw={500} mt='lg' mb='xs'>
            Top Customers
          </Text>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Orders</Table.Th>
                <Table.Th>Total Spent</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {topCustomers.map((c, i) => (
                <Table.Tr key={i}>
                  <Table.Td>{c.name}</Table.Td>
                  <Table.Td>{c.orders}</Table.Td>
                  <Table.Td>${c.totalSpent.toLocaleString()}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </>
      )}
    </Paper>
  );
}
