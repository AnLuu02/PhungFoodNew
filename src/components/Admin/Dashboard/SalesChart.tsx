'use client';

import { LineChart } from '@mantine/charts';
import { Box, Card, Group, SegmentedControl, Title } from '@mantine/core';
import { useState } from 'react';

const generateMockData = (period: string) => {
  const days = period === '7 ngày' ? 7 : period === '30 ngày' ? 30 : 90;
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
    sales: Math.floor(Math.random() * 1000) + 500
  }));
};

export default function SalesChart() {
  const [period, setPeriod] = useState('7 ngày');
  const data = generateMockData(period);

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder className='h-full'>
      <Group justify='space-between' mb='md'>
        <Title order={4} className='text-gray-800'>
          Doanh số bán hàng
        </Title>
        <SegmentedControl
          value={period}
          onChange={setPeriod}
          data={['7 ngày', '30 ngày', '3 tháng']}
          size='xs'
          className='bg-gray-100'
        />
      </Group>

      <Box className='h-80'>
        <LineChart
          h={300}
          data={data}
          dataKey='date'
          series={[{ name: 'sales', color: '#3b82f6', label: 'Doanh số (VNĐ)' }]}
          curveType='linear'
          gridAxis='xy'
          tickLine='xy'
          withTooltip
          className='w-full'
        />
      </Box>
    </Card>
  );
}
