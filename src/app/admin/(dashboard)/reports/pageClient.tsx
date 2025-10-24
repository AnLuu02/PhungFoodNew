'use client';

import { Box, Card, Flex, Group, Paper, Select, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconBrandCashapp, IconCheese, IconReport, IconShoppingCart, IconUser } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { formatMoneyShort } from '~/lib/func-handler/Format';
import { ChangeRate } from './components/ChangeRate';
import { ExportReports } from './components/ExportReportsBtn';
import ReportDetailPageClient from './components/ReportDetail';
import ReportOverviewPageClient from './components/ReportOverview';
import ReportRevenuePageClient from './components/ReportRevenue';
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
export default function ReportPageClient({
  overview,
  topUsers,
  revenueByCategories,
  topProducts,
  revenueByOrderStatus,
  distributionProducts,
  recentActivitiesApp
}: any) {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const router = useRouter();
  const startTime = params.get('startTime');
  const endTime = params.get('endTime');
  const startTimeToNum = startTime ? Number(startTime) : -1;
  const endTimeToNum = endTime ? Number(endTime) : -2;
  const period = Math.floor((endTimeToNum - startTimeToNum) / (24 * 60 * 60 * 1000));
  const dataRevenue = useMemo(() => {
    return [
      {
        label: 'Tổng doanh thu',
        currentValue: overview?.totalFinalRevenue?.currentValue || 0,
        previousValue: overview?.totalFinalRevenue?.previousValue || 0,
        changeRate: overview?.totalFinalRevenue?.changeRate || 0,
        icon: IconBrandCashapp,
        color: '#4ED07E'
      },
      {
        label: 'Tổng người dùng',
        currentValue: overview?.totalUsers?.currentValue || 0,
        previousValue: overview?.totalUsers?.previousValue || 0,
        icon: IconUser,
        changeRate: overview?.totalUsers?.changeRate || 0,
        color: '#4B6CB3'
      },
      {
        label: 'Tổng đơn hàng',
        currentValue: overview?.totalOrders?.currentValue || 0,
        previousValue: overview?.totalOrders?.previousValue || 0,
        changeRate: overview?.totalOrders?.changeRate || 0,
        icon: IconShoppingCart,
        color: '#8547BB'
      },
      {
        label: 'Tổng sản phẩm',
        currentValue: overview?.totalProducts?.currentValue || 0,
        previousValue: overview?.totalProducts?.previousValue || 0,
        changeRate: overview?.totalProducts?.changeRate || 0,
        icon: IconCheese,
        color: '#CB7E56'
      }
    ];
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
      <Paper radius={'lg'} withBorder shadow='md' py={'xl'} px={'xl'}>
        <Flex align={'center'} justify={'space-between'}>
          <Box>
            <Title className='flex items-center gap-2 font-quicksand' order={3}>
              <IconReport size={20} />
              Báo cáo thống kê
            </Title>
            <Text fw={600} size={'sm'} c={'dimmed'}>
              Theo dõi hiệu suất và phân tích dữ liệu hệ thống PhungFood
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
                  let startTime = endTime - Number(value) * 24 * 60 * 60 * 1000;
                  if (value === '0') {
                    const d = new Date(startTime);
                    d.setHours(0, 0, 0, 0);
                    startTime = d.getTime();
                  }
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
      </Paper>

      <SimpleGrid cols={4}>
        {dataRevenue.map((item, index) => {
          const IconR = item.icon;
          return (
            <Card key={index} radius={'lg'} withBorder shadow='md'>
              <Stack gap={'xs'}>
                <Text size='sm' fw={700} c={'dimmed'}>
                  {item.label}
                </Text>
                <Flex align={'center'} justify={'space-between'}>
                  <Title className='font-quicksand' order={3}>
                    {formatMoneyShort(item.currentValue)}
                  </Title>
                  <Paper
                    w={40}
                    h={40}
                    withBorder
                    className='flex items-center justify-center'
                    style={{
                      backgroundColor: item.color + '22'
                    }}
                    radius={'md'}
                  >
                    <IconR size={16} color={item.color} />
                  </Paper>
                </Flex>

                <ChangeRate
                  currentValue={item.currentValue}
                  previousValue={item.previousValue}
                  changeRate={item.changeRate}
                />
              </Stack>
            </Card>
          );
        })}
      </SimpleGrid>

      <ReportOverviewPageClient overviews={overview} />
      <ReportRevenuePageClient
        topUsers={topUsers}
        revenueByCategories={revenueByCategories}
        topProducts={topProducts}
        distributionProducts={distributionProducts}
        revenueByOrderStatus={revenueByOrderStatus}
      />
      <ReportDetailPageClient overviews={overview} recentActivitiesApp={recentActivitiesApp} />
    </Stack>
  );
}
