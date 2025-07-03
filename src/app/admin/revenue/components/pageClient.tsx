'use client';
import { Card, Tabs, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import TableRevenue from './Table/TableRevenue';

export default function RevenueManagementPageClient({
  revenues,
  searchParams
}: {
  revenues: any;
  searchParams?: {
    revenue?: string;
    page?: string;
    limit?: string;
  };
}) {
  const [tab, setTab] = useState<'user' | 'date' | 'month' | 'year'>('user');
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('revenue', tab);
    const url = `${location.pathname}?${params.toString()}`;
    history.replaceState(null, '', url);
  }, [tab]);

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder mt='md'>
      <Title mb='xs' className='font-quicksand'>
        Quản lý doanh thu
      </Title>
      <Tabs value={tab} onChange={(value: any) => setTab(value ?? 'user')} variant='outline'>
        <Tabs.List>
          <Tabs.Tab value='user'>Người dùng</Tabs.Tab>
          <Tabs.Tab value='date'>Theo ngày</Tabs.Tab>
          <Tabs.Tab value='month'>Theo tháng</Tabs.Tab>
          <Tabs.Tab value='year'>Theo năm</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value={tab}>
          <TableRevenue revenues={revenues} s={tab} />
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
}
