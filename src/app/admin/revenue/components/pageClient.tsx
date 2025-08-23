'use client';
import { Card, Divider, Flex, Tabs, Title } from '@mantine/core';
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
      <Tabs
        value={tab}
        onChange={(value: any) => setTab(value ?? 'user')}
        variant='pills'
        styles={{
          tab: {
            border: '1px solid',
            marginRight: 6
          }
        }}
        classNames={{
          tab: `!rounded-md !border-[#e5e5e5] !font-bold hover:bg-mainColor/10 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed`
        }}
      >
        <Flex align='center' justify={'space-between'}>
          <Title className='font-quicksand'>Quản lý doanh thu</Title>
          <Tabs.List>
            <Tabs.Tab value='user'>Người dùng</Tabs.Tab>
            <Tabs.Tab value='date'>Theo ngày</Tabs.Tab>
            <Tabs.Tab value='month'>Theo tháng</Tabs.Tab>
            <Tabs.Tab value='year'>Theo năm</Tabs.Tab>
          </Tabs.List>
        </Flex>

        <Divider my='sm' />
        <Tabs.Panel value={tab}>
          <TableRevenue revenues={revenues} s={tab} />
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
}
