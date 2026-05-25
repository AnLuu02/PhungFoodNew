import { Stack } from '@mantine/core';
import { Metadata } from 'next';
import { api, HydrateClient } from '~/trpc/server';
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
export default async function ReportPage({
  searchParams
}: {
  searchParams?: {
    startTime?: string;
    endTime?: string;
  };
}) {
  const startTimeToNum = searchParams?.startTime ? Number(searchParams?.startTime) : undefined;
  const endTimeToNum = searchParams?.endTime ? Number(searchParams?.endTime) : undefined;
  const queryOverview = { startTime: startTimeToNum, endTime: endTimeToNum };
  await api.Revenue.getOverview.prefetch(queryOverview);
  return (
    <HydrateClient>
      <Stack mb={'xl'}>
        <FilterSectionReport />
        <ReportStatistics />
        <ReportOverviewPageClient />
        <ReportRevenuePageClient />
        <ReportDetailPageClient />
      </Stack>
    </HydrateClient>
  );
}
