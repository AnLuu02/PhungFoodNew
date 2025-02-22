'use client';
import { Card, Tabs, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import TableRevenue from './components/Table/TableRevenue';

export default function RevenueManagementPage({
  searchParams
}: {
  searchParams?: {
    revenue?: string;
    page?: string;
    limit?: string;
  };
}) {
  const [tab, setTab] = useState('user');
  const limit = searchParams?.limit ?? '3';
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
      <Tabs value={tab} onChange={value => setTab(value ?? 'user')}>
        <Tabs.List>
          <Tabs.Tab value='user'>Người dùng</Tabs.Tab>
          <Tabs.Tab value='date'>Theo ngày</Tabs.Tab>
          <Tabs.Tab value='month'>Theo tháng</Tabs.Tab>
          <Tabs.Tab value='year'>Theo năm</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='user'>
          <TableRevenue query={tab} />
        </Tabs.Panel>
        <Tabs.Panel value='date'>
          <TableRevenue query={tab} />
        </Tabs.Panel>
        <Tabs.Panel value='month'>
          <TableRevenue query={tab} />
        </Tabs.Panel>
        <Tabs.Panel value='year'>
          <TableRevenue query={tab} />
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
}
