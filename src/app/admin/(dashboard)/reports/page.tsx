import { Stack } from '@mantine/core';
import { Metadata } from 'next';
import { Period } from '~/shared/types';
import { api, HydrateClient } from '~/trpc/server';
import ReportChartCompare from './components/ReportChartCompare';
import ReportDetailPageClient from './components/ReportDetail';
import { FilterSectionReport } from './components/ReportFilterSection';
import ReportOverviewPageClient from './components/ReportOverview';
import ReportRevenuePageClient from './components/ReportRevenue';
import { ReportStatistics } from './components/ReportStatistics';

export const revalidate = 60 * 60;
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Quản lý báo cáo '
};
export default async function ReportPage() {
  await api.Revenue.getOverview.prefetch({
    period: '_all' as Period
  });
  return (
    <HydrateClient>
      <Stack mb={'xl'}>
        <FilterSectionReport />
        <ReportStatistics />
        <ReportOverviewPageClient />
        <ReportChartCompare />
        <ReportRevenuePageClient />
        <ReportDetailPageClient />
      </Stack>
    </HydrateClient>
  );
}
