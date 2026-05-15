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
  const data = await api.Page.getInitReport(queryOverview);
  return <ReportPageClient data={data} />;
}
