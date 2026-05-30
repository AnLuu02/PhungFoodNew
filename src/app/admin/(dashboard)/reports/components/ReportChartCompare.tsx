'use client';

import { SimpleGrid } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { CommonSkeleton } from '~/components/Loading/LoadingSkeleton';
import dayjs from '~/lib/dayjs';
import { formatDateViVN, toNumber } from '~/lib/FuncHandler/Format';
import { CompareReturn, Period } from '~/shared/types';
import { api } from '~/trpc/react';
import { AreaChartBase } from './AreaChartBase';

export default function ReportChartCompare() {
  const [showAllChart, setShowAllChart] = useState(false);
  const searchParams = useSearchParams();
  const startTimeToNum = toNumber(searchParams.get('startTime') ?? undefined);
  const endTimeToNum = toNumber(searchParams.get('endTime') ?? undefined);
  const period = (searchParams.get('period') ?? '_all') as Period;
  const { data: overviews, isLoading } = api.Revenue.getOverview.useQuery({
    startTime: startTimeToNum,
    endTime: endTimeToNum,
    period
  });

  const startDate = startTimeToNum || dayjs().tz().toDate();
  const endDate = endTimeToNum || dayjs().tz().toDate();
  const periodSize = dayjs(endDate).tz().diff(startDate, 'day');

  const totalUsers: CompareReturn | undefined = overviews?.totalUsers;
  const totalOrders: CompareReturn | undefined = overviews?.totalOrders;
  const totalProducts: CompareReturn | undefined = overviews?.totalProducts;
  const totalFinalRevenue: CompareReturn | undefined = overviews?.totalFinalRevenue;

  const dataOverviewChart = useMemo(() => {
    const summaryRevenue = (totalFinalRevenue?.current?.currentData || []).map(({ date, total }, index) => ({
      label: 'Ngày ' + dayjs(date).format('DD-MM-YYYY'),
      current: total,
      previous: totalFinalRevenue?.previous?.previousData?.[index]?.total || 0
    }));
    const summaryUsers = (totalUsers?.current?.currentData || []).map(({ date, total }, index) => ({
      label: 'Ngày ' + dayjs(date).format('DD-MM-YYYY'),
      current: total,
      previous: totalUsers?.previous?.previousData?.[index]?.total || 0
    }));
    const summaryProducts = (totalProducts?.current?.currentData || []).map(({ date, total }, index) => ({
      label: 'Ngày ' + dayjs(date).format('DD-MM-YYYY'),
      current: total,
      previous: totalProducts?.previous?.previousData?.[index]?.total || 0
    }));
    const summaryOrders = (totalOrders?.current?.currentData || []).map(({ date, total }, index) => ({
      label: 'Ngày ' + dayjs(date).format('DD-MM-YYYY'),
      current: total,
      previous: totalOrders?.previous?.previousData?.[index]?.total || 0
    }));

    return {
      summaryRevenue,
      summaryOrders,
      summaryProducts,
      summaryUsers
    };
  }, [overviews]);
  return (
    <>
      <SimpleGrid cols={1}>
        {isLoading ? (
          <>
            <CommonSkeleton.Chart />
            <CommonSkeleton.Chart />
          </>
        ) : (
          <>
            <AreaChartBase
              dataChart={dataOverviewChart.summaryRevenue}
              startDate={startDate}
              periodSize={periodSize}
              contentHeader={{
                title: 'Biến động doanh thu',
                sub: (
                  <div>
                    Biểu đồ biến động{' '}
                    <b>
                      {periodSize == 0
                        ? 'trong hôm nay'
                        : periodSize > 0
                          ? `từ ${formatDateViVN(startDate)} đến ${formatDateViVN(endDate)}`
                          : ' kể từ đơn hàng đầu tiên'}
                    </b>
                  </div>
                )
              }}
            />

            <AreaChartBase
              dataChart={dataOverviewChart.summaryOrders}
              startDate={startDate}
              periodSize={periodSize}
              contentHeader={{
                title: 'Biến động đơn hàng',
                sub: (
                  <div>
                    Biểu đồ biến động{' '}
                    <b>
                      {periodSize == 0
                        ? 'trong hôm nay'
                        : periodSize > 0
                          ? `từ ${formatDateViVN(startDate)} đến ${formatDateViVN(endDate)}`
                          : ' kể từ đơn hàng đầu tiên'}
                    </b>
                  </div>
                )
              }}
            />

            <AreaChartBase
              dataChart={dataOverviewChart.summaryProducts}
              startDate={startDate}
              periodSize={periodSize}
              contentHeader={{
                title: 'Biến động sản phẩm',
                sub: (
                  <div>
                    Biểu đồ biến động{' '}
                    <b>
                      {periodSize == 0
                        ? 'trong hôm nay'
                        : periodSize > 0
                          ? `từ ${formatDateViVN(startDate)} đến ${formatDateViVN(endDate)}`
                          : ' kể từ đơn hàng đầu tiên'}
                    </b>
                  </div>
                )
              }}
            />

            <AreaChartBase
              dataChart={dataOverviewChart.summaryUsers}
              startDate={startDate}
              periodSize={periodSize}
              contentHeader={{
                title: 'Biến động người dùng',
                sub: (
                  <div>
                    Biểu đồ biến động{' '}
                    <b>
                      {periodSize == 0
                        ? 'trong hôm nay'
                        : periodSize > 0
                          ? `từ ${formatDateViVN(startDate)} đến ${formatDateViVN(endDate)}`
                          : ' kể từ đơn hàng đầu tiên'}
                    </b>
                  </div>
                )
              }}
            />
          </>
        )}
      </SimpleGrid>
    </>
  );
}
