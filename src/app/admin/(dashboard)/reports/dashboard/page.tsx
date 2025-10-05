'use client';

import { Box, Card, Flex, Group, Select, Stack, Tabs, Text, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconBrandCashapp,
  IconCheese,
  IconMessageCircle,
  IconPhoto,
  IconReport,
  IconSettings,
  IconShoppingCart,
  IconUser
} from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { api } from '~/trpc/react';
import { ExportReports } from '../components/ExportReportsBtn';
import { OverviewDashboard } from './components/OverviewDashboard';
import { PerformanceDashboard } from './components/PerformanceDashboard';
import { RevenuesDashboard } from './components/RevenuesDashboard';
import { UsersDashboard } from './components/UsersDashboard';
const dataSelect = [
  {
    value: 'all',
    label: 'Tất cả'
  },
  {
    value: '0',
    label: 'Hôm nay'
  },
  {
    value: '7',
    label: '7 ngày qua'
  },
  {
    value: '15',
    label: '15 ngày qua'
  },
  {
    value: '30',
    label: '30 ngày qua'
  },
  {
    value: 'range-other',
    label: 'Khác',
    disabled: true
  }
];
export default function ReportPageClient({ overview }: any) {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const router = useRouter();
  const startTime = params.get('startTime');
  const endTime = params.get('endTime');
  const startTimeToNum = startTime ? Number(startTime) : -1;
  const endTimeToNum = endTime ? Number(endTime) : -2;
  const period = (endTimeToNum - startTimeToNum) / (24 * 60 * 60 * 1000);
  const { data: dataClient } = api.Revenue.getOverview.useQuery(
    {
      startTime: startTimeToNum >= 0 ? startTimeToNum : undefined,
      endTime: endTimeToNum >= 0 ? startTimeToNum : undefined
    },
    {
      initialData: overview,
      enabled: !!overview
    }
  );
  const dataRevenue = useMemo(() => {
    return [
      {
        label: 'Tổng doanh thu',
        currentValue: dataClient?.totalFinalRevenue?.currentValue || 0,
        previousValue: dataClient?.totalFinalRevenue?.previousValue || 0,
        changeRate: dataClient?.totalFinalRevenue?.changeRate || 0,
        icon: IconBrandCashapp,
        color: '#4ED07E'
      },
      {
        label: 'Tổng người dùng',
        currentValue: dataClient?.totalUsers?.currentValue || 0,
        previousValue: dataClient?.totalUsers?.previousValue || 0,
        icon: IconUser,
        changeRate: dataClient?.totalUsers?.changeRate || 0,
        color: '#4B6CB3'
      },
      {
        label: 'Tổng đơn hàng',
        currentValue: dataClient?.totalOrders?.currentValue || 0,
        previousValue: dataClient?.totalOrders?.previousValue || 0,
        changeRate: dataClient?.totalOrders?.changeRate || 0,
        icon: IconShoppingCart,
        color: '#8547BB'
      },
      {
        label: 'Tổng sản phẩm',
        currentValue: dataClient?.totalProducts?.currentValue || 0,
        previousValue: dataClient?.totalProducts?.previousValue || 0,
        changeRate: dataClient?.totalProducts?.changeRate || 0,
        icon: IconCheese,
        color: '#CB7E56'
      }
    ];
  }, [dataClient]);
  const revenues = dataClient?.revenues || [];
  const dataOverviewChart = useMemo(() => {
    const periodValue = period > 0 ? period : 1;
    const labels = Array.from({ length: periodValue || 1 }, (_, i) => {
      const currentDate = new Date(endTimeToNum - (periodValue !== 1 ? (periodValue - i) * 24 * 60 * 60 * 1000 : 0));
      return `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    });

    const summaryRevenue: Record<string, number> = {};
    const summaryUsers: Record<string, number> = {};
    labels.forEach(label => {
      summaryRevenue[label] = 0;
      summaryUsers[label] = 0;
    });

    revenues.forEach((revenue: any) => {
      const day = +revenue.day;
      const month = +revenue.month;
      const year = +revenue.year;
      const key = `${day}/${month}/${year}`;
      if (labels.includes(key)) {
        summaryRevenue[key]! += Number(revenue.totalSpent);
      }
    });

    const users = dataClient?.users || [];
    users.forEach((user: any) => {
      const date = new Date(user.createdAt);
      const key = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      if (labels.includes(key)) {
        summaryUsers[key]! += 1;
      }
    });

    return {
      revenues: labels.map(label => ({
        label: `Ngày ${label}`,
        revenue: summaryRevenue[label]
      })),
      users: labels.map(label => ({
        label: `Ngày ${label}`,
        users: summaryUsers[label]
      }))
    };
  }, [overview]);
  const valueSelect = useMemo(() => {
    return dataSelect.some(item => item.value === period.toString())
      ? period.toString()
      : period < 0
        ? 'all'
        : 'range-other';
  }, [period]);

  useEffect(() => {
    if (value[0] && value[1]) {
      params.set('startTime', value[0].getTime().toString());
      params.set('endTime', value[1].getTime().toString());
      router.push('/admin/reports?' + params.toString());
    }
  }, [value[1]]);

  useEffect(() => {
    if (period && period >= 0) {
      setValue([new Date(startTimeToNum), new Date(endTimeToNum)]);
    } else {
      setValue([null, null]);
    }
  }, [period]);

  return (
    <Stack mb={'xl'}>
      <Card radius={'md'} withBorder shadow='md' py={'xl'} px={'xl'}>
        <Flex align={'center'} justify={'space-between'}>
          <Box>
            <Title className='flex items-center gap-2 font-quicksand' order={3}>
              <IconReport size={20} />
              Báo cáo tương tác
            </Title>
            <Text fw={600} size={'sm'} c={'dimmed'}>
              Phân tích toàn diện và theo dõi hiệu suất hệ thống PhungFood
            </Text>
          </Box>
          <Group>
            <Select
              allowDeselect={false}
              radius={'md'}
              value={valueSelect}
              onChange={(value: any) => {
                let url = '';
                if (value === 'all') {
                  params.delete('startTime');
                  params.delete('endTime');
                  url = '/admin/reports?' + params.toString();
                } else {
                  const endTime = new Date().getTime();
                  const startTime = endTime - Number(value) * 24 * 60 * 60 * 1000;
                  params.set('startTime', startTime.toString());
                  params.set('endTime', endTime.toString());
                  url = '/admin/reports?' + params.toString();
                }
                router.push(url);
              }}
              defaultValue={'7day'}
              data={dataSelect}
            />
            <Group>
              <DatePickerInput
                type='range'
                placeholder={`${valueSelect === 'all' ? 'Tất cả' : valueSelect === '0' ? 'Hôm nay' : 'Chọn ngày'}`}
                value={value}
                onChange={setValue}
                miw={200}
                radius={'md'}
              />
            </Group>

            <ExportReports />
          </Group>
        </Flex>
      </Card>
      <Card radius={'md'} withBorder shadow='md' py={'xl'} px={'xl'}>
        <Tabs defaultValue='overview'>
          <Tabs.List mb={'md'}>
            <Tabs.Tab value='overview' leftSection={<IconPhoto size={12} />}>
              Tổng quan
            </Tabs.Tab>
            <Tabs.Tab value='revenues' leftSection={<IconMessageCircle size={12} />}>
              Doanh thu
            </Tabs.Tab>
            <Tabs.Tab value='users' leftSection={<IconSettings size={12} />}>
              Người dùng
            </Tabs.Tab>
            <Tabs.Tab value='performance' leftSection={<IconSettings size={12} />}>
              Hiệu suất
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value='overview'>
            <OverviewDashboard
              dataRevenue={dataRevenue}
              period={period}
              startTimeToNum={startTimeToNum}
              endTimeToNum={endTimeToNum}
              dataOverviewChart={dataOverviewChart}
            />
          </Tabs.Panel>

          <Tabs.Panel value='revenues'>
            <RevenuesDashboard
              dataRevenue={dataRevenue}
              period={period}
              startTimeToNum={startTimeToNum}
              endTimeToNum={endTimeToNum}
              dataOverviewChart={dataOverviewChart}
            />
          </Tabs.Panel>

          <Tabs.Panel value='users'>
            <UsersDashboard
              dataRevenue={dataRevenue}
              period={period}
              startTimeToNum={startTimeToNum}
              endTimeToNum={endTimeToNum}
              dataOverviewChart={dataOverviewChart}
            />
          </Tabs.Panel>
          <Tabs.Panel value='performance'>
            <PerformanceDashboard
              dataRevenue={dataRevenue}
              period={period}
              startTimeToNum={startTimeToNum}
              endTimeToNum={endTimeToNum}
              dataOverviewChart={dataOverviewChart}
            />
          </Tabs.Panel>
        </Tabs>
      </Card>
    </Stack>
  );
}
