import { Metadata } from 'next';
import { api } from '~/trpc/server';
import ReportPageClient from './pageClient';
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
  const {
    overview,
    topUsers,
    revenueByCategories,
    topProducts,
    revenueByOrderStatus,
    distributionProducts,
    recentActivitiesApp
  } = await api.Page.getInitReport(queryOverview);
  return (
    <ReportPageClient
      overview={overview.value}
      topUsers={topUsers.value}
      revenueByCategories={revenueByCategories.value}
      topProducts={topProducts.value}
      revenueByOrderStatus={revenueByOrderStatus.value}
      distributionProducts={distributionProducts.value}
      recentActivitiesApp={recentActivitiesApp.value}
    />
  );
}
