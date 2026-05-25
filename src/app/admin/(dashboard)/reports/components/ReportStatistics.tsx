'use client';
import { Card, Flex, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { IconBrandCashapp, IconCheese, IconShoppingCart, IconUser } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { CommonSkeleton } from '~/components/Loading/LoadingSkeleton';
import { formatMoneyShort, toNumber } from '~/lib/FuncHandler/Format';
import { api } from '~/trpc/react';
import { ChangeRate } from './ChangeRate';

export const ReportStatistics = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const startTimeToNum = toNumber(params.get('startTime') ?? undefined);
  const endTimeToNum = toNumber(params.get('endTime') ?? undefined);
  const { data: overview, isLoading } = api.Revenue.getOverview.useQuery({
    startTime: startTimeToNum,
    endTime: endTimeToNum
  });
  const dataRevenue = useMemo(() => {
    return [
      {
        label: 'Tổng doanh thu',
        currentValue: Number(overview?.totalFinalRevenue?.currentValue || 0),
        previousValue: overview?.totalFinalRevenue?.previousValue || 0,
        changeRate: overview?.totalFinalRevenue?.changeRate || 0,
        icon: IconBrandCashapp,
        color: '#4ED07E'
      },
      {
        label: 'Tổng người dùng',
        currentValue: Number(overview?.totalUsers?.currentValue || 0),
        previousValue: overview?.totalUsers?.previousValue || 0,
        icon: IconUser,
        changeRate: overview?.totalUsers?.changeRate || 0,
        color: '#4B6CB3'
      },
      {
        label: 'Tổng đơn hàng',
        currentValue: Number(overview?.totalOrders?.currentValue || 0),
        previousValue: overview?.totalOrders?.previousValue || 0,
        changeRate: overview?.totalOrders?.changeRate || 0,
        icon: IconShoppingCart,
        color: '#8547BB'
      },
      {
        label: 'Tổng sản phẩm',
        currentValue: Number(overview?.totalProducts?.currentValue || 0),
        previousValue: overview?.totalProducts?.previousValue || 0,
        changeRate: overview?.totalProducts?.changeRate || 0,
        icon: IconCheese,
        color: '#CB7E56'
      }
    ];
  }, [overview]);

  return isLoading ? (
    <>
      <CommonSkeleton.StatsGrid count={4} cols={4} />
    </>
  ) : (
    <SimpleGrid cols={4}>
      {dataRevenue.map((item, index) => {
        const IconR = item.icon;
        return (
          <Card key={index} withBorder shadow='md'>
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
                >
                  <IconR size={16} color={item.color} />
                </Paper>
              </Flex>

              <ChangeRate
                currentValue={Number(item.currentValue)}
                previousValue={Number(item.previousValue)}
                changeRate={item.changeRate}
              />
            </Stack>
          </Card>
        );
      })}
    </SimpleGrid>
  );
};
