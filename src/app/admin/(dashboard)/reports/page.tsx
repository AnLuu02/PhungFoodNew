import { Stack } from '@mantine/core';
import { Metadata } from 'next';
import { Period } from '~/shared/types';
import { api, HydrateClient } from '~/trpc/server';
import ReportChartCompare from '~/app/admin/(dashboard)/reports/components/report-chart-compare';
import ReportDetailPageClient from '~/app/admin/(dashboard)/reports/components/report-detail';
import { FilterSectionReport } from '~/app/admin/(dashboard)/reports/components/report-filter-section';
import ReportOverviewPageClient from '~/app/admin/(dashboard)/reports/components/report-overview';
import ReportRevenuePageClient from '~/app/admin/(dashboard)/reports/components/report-revenue';
import { ReportStatistics } from '~/app/admin/(dashboard)/reports/components/report-statistics';

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
