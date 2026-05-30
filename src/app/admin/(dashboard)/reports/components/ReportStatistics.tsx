'use client';
import { Badge, Box, Group, Paper, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core';
import {
  IconBrandCashapp,
  IconCalendarStats,
  IconCheese,
  IconClockHour4,
  IconShoppingCart,
  IconUser
} from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { CommonSkeleton } from '~/components/Loading/LoadingSkeleton';
import { formatDateViVN, formatMoneyShort, toNumber } from '~/lib/FuncHandler/Format';
import { buildChangeRateData } from '~/lib/FuncHandler/Statistics';
import { Period } from '~/shared/types';
import { api } from '~/trpc/react';
import { AnalyticsMetricCard } from '../../components/AnalyticsMetricCard';

export const ReportStatistics = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const startTimeToNum = toNumber(params.get('startTime') ?? undefined);
  const endTimeToNum = toNumber(params.get('endTime') ?? undefined);
  const period = params.get('period') ?? '_all';
  const { data: overview, isLoading } = api.Revenue.getOverview.useQuery({
    startTime: startTimeToNum,
    endTime: endTimeToNum,
    period: period as Period
  });

  const { dataRevenue, periodItems } = useMemo(() => {
    return {
      dataRevenue: [
        {
          label: 'Tổng doanh thu',
          currentValue: Number(overview?.totalFinalRevenue?.current?.value || 0),
          previousSparkline: overview?.totalFinalRevenue?.previous?.sparkline || [0, 0, 0, 0, 0, 0, 0],
          currentSparkline: overview?.totalFinalRevenue?.current?.sparkline || [0, 0, 0, 0, 0, 0, 0],
          changeRate: overview?.totalFinalRevenue?.changeRate || 0,
          icon: IconBrandCashapp,
          color: 'blue'
        },
        {
          label: 'Tổng người dùng',
          currentValue: Number(overview?.totalUsers?.current?.value || 0),
          previousSparkline: overview?.totalUsers?.previous?.sparkline || [0, 0, 0, 0, 0, 0, 0],
          currentSparkline: overview?.totalUsers?.current?.sparkline || [0, 0, 0, 0, 0, 0, 0],
          changeRate: overview?.totalUsers?.changeRate || 0,
          icon: IconUser,
          color: 'green'
        },
        {
          label: 'Tổng đơn hàng',
          currentValue: Number(overview?.totalOrders?.current?.value || 0),
          previousSparkline: overview?.totalOrders?.previous?.sparkline || [0, 0, 0, 0, 0, 0, 0],
          currentSparkline: overview?.totalOrders?.current?.sparkline || [0, 0, 0, 0, 0, 0, 0],
          changeRate: overview?.totalOrders?.changeRate || 0,
          icon: IconShoppingCart,
          color: 'orange'
        },
        {
          label: 'Tổng sản phẩm',
          currentValue: Number(overview?.totalProducts?.current?.value || 0),
          previousSparkline: overview?.totalProducts?.previous?.sparkline || [0, 0, 0, 0, 0, 0, 0],
          currentSparkline: overview?.totalProducts?.current?.sparkline || [0, 0, 0, 0, 0, 0, 0],
          changeRate: overview?.totalProducts?.changeRate || 0,
          icon: IconCheese,
          color: 'violet'
        }
      ],
      periodItems: [
        {
          label: 'Kỳ trước',
          description: 'Dữ liệu dùng để so sánh',
          color: 'red',
          bg: 'bg-red-50 dark:bg-transparent',
          border: 'border-red-100  dark:border-dark-card',
          startDate: overview?.totalFinalRevenue?.previous?.startDate,
          endDate: overview?.totalFinalRevenue?.previous?.endDate
        },
        {
          label: 'Kỳ hiện tại',
          description: 'Dữ liệu đang được phân tích',
          color: 'blue',
          bg: 'bg-blue-50 dark:bg-transparent',
          border: 'border-blue-100  dark:border-dark-card',
          startDate: overview?.totalFinalRevenue?.current?.startDate,
          endDate: overview?.totalFinalRevenue?.current?.endDate
        }
      ]
    };
  }, [overview]);

  return isLoading ? (
    <>
      <CommonSkeleton.StatsGrid count={4} cols={4} />
    </>
  ) : (
    <>
      <Box className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {periodItems.map(item => (
          <Paper
            key={item.label}
            withBorder
            radius='lg'
            p='md'
            className={`${item.bg} ${item.border} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
          >
            <Stack gap='sm'>
              <Group justify='space-between' align='flex-start'>
                <Group gap='sm'>
                  <ThemeIcon color={item.color} variant='light' radius='xl' size={42}>
                    <IconCalendarStats size={22} />
                  </ThemeIcon>

                  <Box>
                    <Text fw={700} size='sm'>
                      {item.label}
                    </Text>
                    <Text size='xs' c='dimmed'>
                      {item.description}
                    </Text>
                  </Box>
                </Group>

                <Badge color={item.color} variant='light' py={'xs'}>
                  Báo cáo
                </Badge>
              </Group>

              <Paper className='bg-white/70 p-3 dark:bg-transparent' withBorder>
                <Stack gap={8}>
                  <Group justify='space-between' gap='xs'>
                    <Group gap={6}>
                      <IconClockHour4 size={16} />
                      <Text size='xs' c='dimmed'>
                        Bắt đầu
                      </Text>
                    </Group>

                    <Text size='sm' fw={600}>
                      {formatDateViVN(item.startDate, { hour: true })}
                    </Text>
                  </Group>

                  <Group justify='space-between' gap='xs'>
                    <Group gap={6}>
                      <IconClockHour4 size={16} />
                      <Text size='xs' c='dimmed'>
                        Kết thúc
                      </Text>
                    </Group>

                    <Text size='sm' fw={600}>
                      {formatDateViVN(item.endDate, { hour: true })}
                    </Text>
                  </Group>
                </Stack>
              </Paper>
            </Stack>
          </Paper>
        ))}
      </Box>
      <SimpleGrid cols={4}>
        {dataRevenue.map((item, index) => {
          const IconR = item.icon;
          return (
            <AnalyticsMetricCard
              key={index}
              title={item.label}
              value={formatMoneyShort(item.currentValue).toString()}
              descObj={buildChangeRateData(item.changeRate, period as Period)}
              color={item.color}
              icon={<IconR size={24} />}
              previousSparkline={item.previousSparkline}
              currentSparkline={item.currentSparkline}
            />
          );
        })}
      </SimpleGrid>
    </>
  );
};
