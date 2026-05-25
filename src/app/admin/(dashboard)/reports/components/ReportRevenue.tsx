'use client';

import { Divider, Grid, GridCol, Paper, SimpleGrid, Stack, Title } from '@mantine/core';
import { OrderStatus } from '@prisma/client';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { toNumber } from '~/lib/FuncHandler/Format';
import { getStatusInfo } from '~/lib/FuncHandler/status-order';
import { api } from '~/trpc/react';
import { PieChartBase } from './PieChartBase';
import { TopProductTable } from './TopProductTable';
import { TopUserTable } from './TopUserTable';
const colors = ['blue.6', 'green.6', 'orange.6', 'red.6', 'gray.6'];
export default function ReportRevenuePageClient() {
  const searchParams = useSearchParams();
  const startTimeToNum = toNumber(searchParams?.get('startTime') ?? undefined);
  const endTimeToNum = toNumber(searchParams?.get('endTime') ?? undefined);
  const { data: revenueByCategories, isLoading } = api.Revenue.getRevenueByCategory.useQuery({
    startTime: startTimeToNum,
    endTime: endTimeToNum
  });
  const { data: revenueByOrderStatus, isLoading: isLoading1 } = api.Revenue.getRevenueOrderStatus.useQuery({
    startTime: startTimeToNum,
    endTime: endTimeToNum
  });
  const { data: distributionProducts, isLoading: isLoading2 } = api.Revenue.getDistributionProducts.useQuery({
    startTime: startTimeToNum,
    endTime: endTimeToNum
  });
  const revenueByCategoriesRender = useMemo(() => {
    if (!revenueByCategories) return [];
    const revenueByCategoriesArr = Object.entries(revenueByCategories || {});
    return revenueByCategoriesArr.map(([label, value]: any, index: number) => {
      return {
        name: label,
        value: value,
        color: colors[index] || 'gray.6'
      };
    });
  }, [revenueByCategories]);
  const distributionProductsRender = useMemo(() => {
    if (!distributionProducts) return [];
    const distributionProductsArr = Object.entries(distributionProducts || {});
    return distributionProductsArr.map(([label, value]: any, index: number) => {
      return {
        name: label,
        value: value,
        color: colors[index] || 'gray.6'
      };
    });
  }, [distributionProducts]);
  const revenueByOrderStatusRender = useMemo(() => {
    if (!revenueByOrderStatus || revenueByOrderStatus?.length <= 0) return [];

    const revenueByOrderStatusArr = Object.entries(OrderStatus || {});
    return revenueByOrderStatusArr.map(([label]: any, index: number) => {
      const existed = revenueByOrderStatus.find((item: any) => item.status === label);
      if (existed) {
        return {
          name: getStatusInfo(label).label,
          value: existed.profit || 0,
          color: colors[index] || 'gray.6'
        };
      }
      return {
        name: getStatusInfo(label).label,
        value: 0,
        color: colors[index] || 'gray.6'
      };
    });
  }, [revenueByOrderStatus]);

  return (
    <>
      <Stack>
        <Paper withBorder shadow='md' py={'xl'} px={'xl'}>
          <Title order={4} mb={'lg'} className='font-quicksand'>
            Biểu đồ doanh thu
          </Title>
          <Grid>
            <GridCol span={12} className='h-fit'>
              <TopUserTable startTime={startTimeToNum} endTime={endTimeToNum} />
              <Divider my={'md'} />
              <TopProductTable startTime={startTimeToNum} endTime={endTimeToNum} />
            </GridCol>
            <GridCol span={12} className='h-fit'>
              <SimpleGrid cols={2}>
                <PieChartBase
                  title={'Doanh thu theo danh mục'}
                  loading={isLoading}
                  dataChart={revenueByCategoriesRender}
                />
                <PieChartBase
                  title={'Doanh thu theo trang thái đơn hàng'}
                  loading={isLoading1}
                  dataChart={revenueByOrderStatusRender}
                />
              </SimpleGrid>
            </GridCol>
            <GridCol span={12} className='h-fit'>
              <SimpleGrid cols={2}>
                <PieChartBase
                  title={'Phân bổ sản phẩm'}
                  loading={isLoading2}
                  dataChart={distributionProductsRender}
                  valueFormatter={value => value + ' món'}
                />
                <TopProductTable startTime={startTimeToNum} endTime={endTimeToNum} />
              </SimpleGrid>
            </GridCol>
          </Grid>
        </Paper>
      </Stack>
    </>
  );
}
