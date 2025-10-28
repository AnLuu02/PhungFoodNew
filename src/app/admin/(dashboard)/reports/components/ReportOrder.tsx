'use client';

import { LineChart, PieChart } from '@mantine/charts';
import { Card, Grid, GridCol, Paper, Title } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';

const orderStatusData = [
  { name: 'Hoàn thành', value: 850, color: 'green.6' },
  { name: 'Đang xử lý', value: 150, color: 'blue.6' },
  { name: 'Đã hủy', value: 50, color: 'red.6' },
  { name: 'Đang giao', value: 195, color: 'orange.6' }
];

export default function ReportOrderPageClient({ overviews }: any) {
  const revenues = overviews.revenues || [];
  const searchParams = useSearchParams();
  const startTime = searchParams.get('startTime');
  const endTime = searchParams.get('endTime');
  const startTimeToNum = (startTime && Number(startTime)) || new Date().getTime();
  const endTimeToNum = (endTime && Number(endTime)) || new Date().getTime();
  const period = !(endTimeToNum - startTimeToNum) ? 1 : (endTimeToNum - startTimeToNum) / (24 * 60 * 60 * 1000) + 1;

  const dataOverviewChart = useMemo(() => {
    const labels = Array.from({ length: +period }, (_, i) => {
      const currentDate = new Date(endTimeToNum - (period !== 1 ? (+period - i - 1) * 24 * 60 * 60 * 1000 : 0));
      return `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    });
    const summaryRevenue: Record<string, number> = {};
    labels.forEach(label => {
      summaryRevenue[label] = 0;
    });

    revenues.forEach((revenue: any) => {
      const day = +revenue.day;
      const month = +revenue.month;
      const year = +revenue.year;
      const key = `${day}/${month}/${year}`;
      if (labels.includes(key)) {
        summaryRevenue[key]! += Number(revenue.totalOrders);
      }
    });
    return {
      revenues: labels.map(label => ({
        label: `Ngày ${label}`,
        order: summaryRevenue[label]
      }))
    };
  }, [overviews]);
  return (
    <>
      <Paper radius={'md'} withBorder shadow='md' py={'xl'} px={'xl'}>
        <Title order={4} mb={'lg'} className='font-quicksand'>
          Phân tích đơn hàng
        </Title>
        <Grid>
          <GridCol span={8}>
            <Card withBorder shadow='sm'>
              <Title order={5} mb={'md'} className='font-quicksand'>
                Xu hướng đơn hàng
              </Title>
              <LineChart
                h={300}
                data={dataOverviewChart.revenues}
                dataKey='label'
                series={[{ name: 'order', label: 'Đơn hàng', color: 'blue.6' }]}
                curveType='linear'
                gridAxis='xy'
                withDots={false}
              />
            </Card>
          </GridCol>
          <GridCol span={4}>
            <Card withBorder shadow='sm'>
              <Title order={5} mb={'md'} className='font-quicksand'>
                Trạng thái đơn hàng
              </Title>
              <PieChart
                h={300}
                data={orderStatusData}
                withLabels
                withTooltip
                size={200}
                valueFormatter={value => formatPriceLocaleVi(value)}
              />
            </Card>
          </GridCol>
        </Grid>
      </Paper>
    </>
  );
}
