'use client';

import { BarChart, LineChart } from '@mantine/charts';
import { Box, Flex, Group, Paper, Select, SimpleGrid, Skeleton, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendarStats } from '@tabler/icons-react';
import { ManipulateType } from 'dayjs';
import { Session } from 'next-auth';
import { useMemo, useState } from 'react';
import dayjs from '~/lib/dayjs';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { getDatesObjBetween } from '~/lib/FuncHandler/Statistics';
import { DATA_SELECT_PERIOD } from '~/shared/constants/filter.constants';
import { GetOverviewUser } from '~/shared/type-trpc/user.type-trpc';
import { Period } from '~/shared/types';
import { api } from '~/trpc/react';

export function UserStatistics({
  user,
  session
}: {
  user: NonNullable<GetOverviewUser>['user'];
  session: Session | null;
}) {
  const userId = session?.user?.id;
  const [selectedPeriod, setSelectedPeriod] = useState<{ startTime?: number; endTime?: number; period: Period }>({
    period: '_all'
  });
  const { data, isLoading: isLoadingRevenue } = api.Revenue.getStatisticsSpentUser.useQuery(
    {
      userId: userId || '',
      period: selectedPeriod.period,
      startTime: selectedPeriod?.startTime,
      endTime: selectedPeriod?.endTime
    },
    { enabled: !!selectedPeriod, placeholderData: previousData => previousData }
  );
  console.log(selectedPeriod);

  const { spendingTrendData, orderFrequencyData, averageSpendingData, totalSpent } = useMemo(() => {
    let totalSpent = 0;
    const overviews = data?.overviews;
    const objRangeDates = getDatesObjBetween(
      selectedPeriod?.startTime ?? dayjs().subtract(1, 'year').toDate(),
      selectedPeriod.endTime ?? dayjs().toDate(),
      {
        format: 'DD-MM-YYYY',
        timezone: 'Asia/Ho_Chi_Minh'
      }
    );
    const objRangeDateSpent = getDatesObjBetween(
      selectedPeriod?.startTime ?? dayjs().subtract(1, 'year').toDate(),
      selectedPeriod.endTime ?? dayjs().toDate(),
      {
        format: 'DD-MM-YYYY',
        timezone: 'Asia/Ho_Chi_Minh'
      }
    );
    const objRangeDateTotalOrder = { ...objRangeDates };
    const objRangeDateAvgSpent = { ...objRangeDates };

    if (overviews && overviews?.length > 0) {
      overviews.forEach(item => {
        totalSpent += Number(item?.netRevenue ?? 0);
        const key = item?.date;
        if (key && key in objRangeDates) {
          objRangeDateSpent[key] = Number(item?.netRevenue ?? 0);
          objRangeDateTotalOrder[key] = Number(item?.totalOrders ?? 0);
          objRangeDateAvgSpent[key] = Number(
            item?.totalOrders && item?.totalOrders > 0
              ? (Number(item?.netRevenue ?? 0) ?? 0) / (item?.totalOrders ?? 1)
              : 0
          );
        }
      });
    }

    return {
      spendingTrendData: Object.entries(objRangeDateSpent).map(([date, amount]) => ({ date, amount })),
      orderFrequencyData: Object.entries(objRangeDateTotalOrder).map(([date, orders]) => ({ date, orders })),
      averageSpendingData: Object.entries(objRangeDateAvgSpent).map(([date, average]) => ({ date, average })),
      totalSpent
    };
  }, [data, isLoadingRevenue]);

  const totalOrders = user?.order?.length ?? 0;
  const averageOrderValue = (totalOrders > 0 ? Number(totalSpent) / totalOrders : 0)?.toFixed(0);
  const hasSelectedRange = Boolean(selectedPeriod.startTime && selectedPeriod.endTime);

  const selectedStartDate = hasSelectedRange ? dayjs(selectedPeriod.startTime).toDate() : null;
  const selectedEndDate = hasSelectedRange ? dayjs(selectedPeriod.endTime).toDate() : null;

  const selectedRangeLabel = hasSelectedRange
    ? selectedPeriod.period === '_today'
      ? `Hôm nay từ ${dayjs().tz().startOf('day').format('HH:mm')} đến ${dayjs().tz().format('HH:mm [phút]')}`
      : `${dayjs(selectedPeriod.startTime).format('DD/MM/YYYY')} - ${dayjs(selectedPeriod.endTime).format('DD/MM/YYYY')}`
    : 'Toàn bộ thời gian';

  const selectedTotalDays = hasSelectedRange
    ? Math.max(
        dayjs(selectedPeriod.endTime).startOf('day').diff(dayjs(selectedPeriod.startTime).startOf('day'), 'day'),
        1
      )
    : null;
  return (
    <>
      <Stack gap='md'>
        <Paper
          p={{ base: 'lg', md: 'xl' }}
          className='relative overflow-hidden border border-slate-200 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-dark-card'
        >
          <Box className='absolute -right-28 -top-28 h-72 w-72 rounded-full bg-mainColor/[0.06] blur-3xl' />
          <Box className='absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-violet-500/[0.05] blur-3xl' />

          <Stack gap='xl' className='relative'>
            <Flex
              align={{ base: 'stretch', lg: 'flex-start' }}
              justify='space-between'
              direction={{ base: 'column', lg: 'row' }}
              gap='lg'
            >
              <Box className='max-w-xl'>
                <Group gap='xs' mb={8}>
                  <Box className='h-px w-9 bg-mainColor' />

                  <Text size='xs' fw={900} tt='uppercase' lts={2} className='text-mainColor'>
                    Thống kê chi tiêu
                  </Text>
                </Group>
                <Title
                  order={2}
                  mt={6}
                  className='font-quicksand text-2xl font-black text-slate-950 dark:text-white sm:text-3xl'
                >
                  Thói quen khách hàng
                </Title>

                <Text size='sm' c='dimmed' mt={8} className='leading-6'>
                  Tập trung vào số tiền đã chi, tần suất đặt món và xu hướng thay đổi theo từng khoảng thời gian.
                </Text>
              </Box>

              <Flex gap={6} align='center' direction={{ base: 'column', sm: 'row' }} wrap='nowrap'>
                <Select
                  allowDeselect={false}
                  value={selectedPeriod.period}
                  onChange={value => {
                    let startTime = undefined;
                    let endTime = undefined;

                    if (value && !['_custom', '_all'].includes(value)) {
                      const arr = value.split('_') ?? [0, 'day'];
                      const periodSize = arr[0] ? Number(arr[0]) : 0;
                      const unit = (arr[1] !== 'today' ? arr[1] : 'day') as ManipulateType | undefined;

                      endTime = dayjs().toDate().getTime();
                      startTime = dayjs()
                        .subtract(unit !== 'month' ? periodSize : periodSize - 1, unit)
                        .startOf(unit as any)
                        .toDate()
                        .getTime();
                    }

                    setSelectedPeriod({
                      startTime,
                      endTime,
                      period: value as Period
                    });
                  }}
                  data={DATA_SELECT_PERIOD}
                  className='w-full sm:w-[150px] sm:shrink-0'
                />

                <DatePickerInput
                  type='range'
                  leftSection={<IconCalendarStats size={20} />}
                  value={[selectedStartDate, selectedEndDate]}
                  onChange={value => {
                    if (value?.[0] && value?.[1]) {
                      setSelectedPeriod({
                        startTime: dayjs(value[0]).startOf('day').toDate().getTime(),
                        endTime: dayjs(value[1]).endOf('day').toDate().getTime(),
                        period: '_custom'
                      });
                    }
                  }}
                  placeholder='Chọn khoảng thời gian'
                  valueFormat='DD/MM/YYYY'
                  className='w-full sm:w-[max-content]'
                />
              </Flex>
            </Flex>

            <Paper
              p={{ base: 'md', sm: 'lg' }}
              className='relative overflow-hidden border border-mainColor/10 bg-mainColor/[0.035] dark:border-white/10 dark:bg-white/[0.035]'
            >
              <Box className='absolute -right-16 -top-16 h-40 w-40 rounded-full bg-mainColor/10 blur-3xl' />

              <Flex
                className='relative'
                align={{ base: 'flex-start', md: 'center' }}
                justify='space-between'
                gap='lg'
                direction={{ base: 'column', md: 'row' }}
              >
                <Group gap='md' align='flex-start' wrap='nowrap'>
                  <ThemeIcon
                    size={48}
                    radius='xl'
                    className='shrink-0 border border-mainColor/15 bg-white text-mainColor shadow-sm dark:border-white/10 dark:bg-dark-card'
                  >
                    <IconCalendarStats size={24} />
                  </ThemeIcon>

                  <Box>
                    <Text size='xs' fw={900} tt='uppercase' lts={1.6} className='text-mainColor'>
                      Khoảng thời gian đang xem
                    </Text>

                    <Text mt={4} fw={900} className='font-quicksand text-lg text-slate-950 dark:text-white sm:text-xl'>
                      {selectedRangeLabel}
                    </Text>

                    <Text mt={4} size='sm' c='dimmed' className='leading-6'>
                      Dữ liệu bên dưới được tổng hợp theo khoảng thời gian này để dễ so sánh chi tiêu và tần suất đặt
                      món.
                    </Text>
                  </Box>
                </Group>

                <SimpleGrid cols={2} spacing='xs' className='w-full shrink-0 md:w-[260px]'>
                  <Paper
                    p='md'
                    className='min-w-0 border border-white/70 bg-white/80 text-center shadow-sm dark:border-white/10 dark:bg-dark-card/80'
                  >
                    <Text size='xs' c='dimmed' fw={700} className='whitespace-nowrap'>
                      Số ngày
                    </Text>

                    <Text fw={900} className='whitespace-nowrap font-quicksand text-slate-950 dark:text-white'>
                      {selectedTotalDays ? `${selectedTotalDays} ngày` : 'Tất cả'}
                    </Text>
                  </Paper>

                  <Paper
                    p='md'
                    className='min-w-0 border border-white/70 bg-white/80 text-center shadow-sm dark:border-white/10 dark:bg-dark-card/80'
                  >
                    <Text size='xs' c='dimmed' fw={700} className='whitespace-nowrap'>
                      Chế độ
                    </Text>

                    <Text fw={900} className='whitespace-nowrap font-quicksand text-slate-950 dark:text-white'>
                      {selectedPeriod.period === '_custom' ? 'Tùy chọn' : 'Nhanh'}
                    </Text>
                  </Paper>
                </SimpleGrid>
              </Flex>
            </Paper>

            <SimpleGrid cols={{ base: 1, lg: 12 }} spacing='md'>
              <Paper
                p={{ base: 'lg', md: 'xl' }}
                className='relative overflow-hidden border border-mainColor/10 bg-slate-950 text-white shadow-[0_18px_46px_rgba(15,23,42,0.18)] dark:border-white/10 lg:col-span-5'
              >
                <Box className='absolute -right-20 -top-20 h-56 w-56 rounded-full bg-mainColor/30 blur-3xl' />
                <Box className='absolute -bottom-24 left-10 h-52 w-52 rounded-full bg-violet-500/20 blur-3xl' />

                <Stack gap='lg' className='relative'>
                  <Box>
                    <Text size='xs' fw={900} tt='uppercase' lts={1.8} className='text-white/60'>
                      Tổng chi tiêu
                    </Text>

                    <Text mt={8} fw={900} className='font-quicksand text-3xl text-white sm:text-4xl'>
                      {formatPriceLocaleVi(totalSpent ?? 0)}
                    </Text>

                    <Text mt={8} size='sm' className='max-w-sm leading-6 text-white/65'>
                      Tổng số tiền đã phát sinh trong khoảng thời gian bạn đang xem.
                    </Text>
                  </Box>

                  <Box className='h-px bg-white/10' />

                  <Group justify='space-between' gap='md'>
                    <Box>
                      <Text size='xs' className='text-white/55'>
                        Trung bình mỗi ngày
                      </Text>

                      <Text mt={4} fw={900} className='font-quicksand text-lg text-white'>
                        {formatPriceLocaleVi((totalSpent ?? 0) / (selectedTotalDays ?? spendingTrendData.length ?? 1))}
                      </Text>
                    </Box>

                    <Box ta='right'>
                      <Text size='xs' className='text-white/55'>
                        Khoảng xem
                      </Text>

                      <Text mt={4} fw={900} className='font-quicksand text-lg text-white'>
                        {selectedTotalDays ? `${selectedTotalDays} ngày` : 'Tất cả'}
                      </Text>
                    </Box>
                  </Group>
                </Stack>
              </Paper>

              <Paper
                p={{ base: 'lg', md: 'xl' }}
                radius='xl'
                className='border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03] lg:col-span-7'
              >
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='md' className='h-full'>
                  <Box className='flex h-full flex-col justify-between rounded-3xl border border-slate-100 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-white/[0.03]'>
                    <Box>
                      <Group justify='space-between' align='flex-start' wrap='nowrap'>
                        <Box>
                          <Text size='xs' c='dimmed' fw={800} tt='uppercase' lts={1.4}>
                            Số lần đặt món
                          </Text>

                          <Text mt={8} fw={900} className='font-quicksand text-3xl text-slate-950 dark:text-white'>
                            {totalOrders ?? 0}
                          </Text>
                        </Box>
                      </Group>
                    </Box>

                    <Text mt='xl' size='sm' c='dimmed' className='leading-6'>
                      Phản ánh mức độ quay lại và thói quen đặt món trong từng giai đoạn.
                    </Text>
                  </Box>

                  <Box className='flex h-full flex-col justify-between rounded-3xl border border-slate-100 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-white/[0.03]'>
                    <Box>
                      <Group justify='space-between' align='flex-start' wrap='nowrap'>
                        <Box>
                          <Text size='xs' c='dimmed' fw={800} tt='uppercase' lts={1.4}>
                            Trung bình mỗi đơn
                          </Text>

                          <Text mt={8} fw={900} className='font-quicksand text-3xl text-slate-950 dark:text-white'>
                            {formatPriceLocaleVi(averageOrderValue ?? 0)}
                          </Text>
                        </Box>
                      </Group>
                    </Box>

                    <Text mt='xl' size='sm' c='dimmed' className='leading-6'>
                      Cho biết mỗi lần đặt món thường có giá trị chi tiêu ở mức nào.
                    </Text>
                  </Box>
                </SimpleGrid>
              </Paper>
            </SimpleGrid>

            <Paper
              p={{ base: 'sm', sm: 'md' }}
              className='overflow-hidden border border-slate-100 bg-slate-50/70 dark:border-white/10 dark:bg-white/[0.03]'
            >
              <Flex justify='space-between' align='center' gap='md' mb='md'>
                <Box>
                  <Text fw={900} className='font-quicksand text-lg text-slate-950 dark:text-white'>
                    Biến động chi tiêu
                  </Text>

                  <Text size='sm' c='dimmed' mt={2}>
                    Số tiền đã chi theo từng ngày trong khoảng thời gian đã chọn.
                  </Text>
                </Box>
              </Flex>

              {isLoadingRevenue ? (
                <Box className='h-[260px] sm:h-[330px]'>
                  <Skeleton height='100%' width='100%' radius='lg' animate />
                </Box>
              ) : (
                <Box className='h-[260px] sm:h-[330px]'>
                  <LineChart
                    data={spendingTrendData}
                    dataKey='date'
                    series={[
                      {
                        name: 'amount',
                        label: 'Chi tiêu',
                        color: 'blue'
                      }
                    ]}
                    curveType='natural'
                    withTooltip
                    h='100%'
                    valueFormatter={formatPriceLocaleVi}
                    yAxisProps={{
                      width: 76,
                      tickFormatter: value =>
                        new Intl.NumberFormat('vi-VN', {
                          notation: 'compact',
                          maximumFractionDigits: 1
                        }).format(Number(value))
                    }}
                    xAxisProps={{
                      tickMargin: 10
                    }}
                  />
                </Box>
              )}
            </Paper>
          </Stack>
        </Paper>

        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing='md'>
          <Paper
            p={{ base: 'lg', md: 'xl' }}
            className='relative overflow-hidden border border-slate-200 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-dark-card'
          >
            <Box className='absolute -right-24 -top-24 h-64 w-64 rounded-full bg-orange-500/[0.06] blur-3xl' />

            <Stack gap='lg' className='relative'>
              <Box>
                <Text size='xs' fw={900} tt='uppercase' lts={1.8} className='text-mainColor'>
                  Tần suất
                </Text>

                <Text mt={4} fw={900} className='font-quicksand text-xl text-slate-950 dark:text-white'>
                  Số lần đặt món
                </Text>

                <Text size='sm' c='dimmed' mt={4} className='leading-6'>
                  Cho biết bạn đặt món dày hay thưa trong từng ngày.
                </Text>
              </Box>

              {isLoadingRevenue ? (
                <Box className='h-[250px]'>
                  <Skeleton height='100%' width='100%' radius='lg' animate />
                </Box>
              ) : (
                <Box className='h-[250px]'>
                  <BarChart
                    data={orderFrequencyData}
                    dataKey='date'
                    series={[
                      {
                        name: 'orders',
                        label: 'Số đơn',
                        color: 'orange'
                      }
                    ]}
                    h='100%'
                    withTooltip
                    yAxisProps={{
                      width: 42,
                      allowDecimals: false
                    }}
                    xAxisProps={{
                      tickMargin: 10
                    }}
                  />
                </Box>
              )}
            </Stack>
          </Paper>

          <Paper
            p={{ base: 'lg', md: 'xl' }}
            className='relative overflow-hidden border border-slate-200 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-dark-card'
          >
            <Box className='absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/[0.06] blur-3xl' />

            <Stack gap='lg' className='relative'>
              <Box>
                <Text size='xs' fw={900} tt='uppercase' lts={1.8} className='text-mainColor'>
                  Giá trị đơn hàng
                </Text>

                <Text mt={4} fw={900} className='font-quicksand text-xl text-slate-950 dark:text-white'>
                  Trung bình chi tiêu mỗi ngày
                </Text>

                <Text size='sm' c='dimmed' mt={4} className='leading-6'>
                  So sánh mức chi trung bình để thấy ngày nào bạn đặt nhiều hơn bình thường.
                </Text>
              </Box>

              {isLoadingRevenue ? (
                <Box className='h-[250px]'>
                  <Skeleton height='100%' width='100%' radius='lg' animate />
                </Box>
              ) : (
                <Box className='h-[250px]'>
                  <LineChart
                    data={averageSpendingData}
                    dataKey='date'
                    series={[
                      {
                        name: 'average',
                        label: 'Trung bình',
                        color: 'violet'
                      }
                    ]}
                    curveType='natural'
                    withTooltip
                    h='100%'
                    valueFormatter={formatPriceLocaleVi}
                    yAxisProps={{
                      width: 76,
                      tickFormatter: value =>
                        new Intl.NumberFormat('vi-VN', {
                          notation: 'compact',
                          maximumFractionDigits: 1
                        }).format(Number(value))
                    }}
                    xAxisProps={{
                      tickMargin: 10
                    }}
                  />
                </Box>
              )}
            </Stack>
          </Paper>
        </SimpleGrid>
      </Stack>
    </>
  );
}
