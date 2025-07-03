import { Metadata } from 'next';
import { api } from '~/trpc/server';
import RevenueManagementPageClient from './components/pageClient';
export const metadata: Metadata = {
  title: 'Quản lý doanh thu '
};
export default async function RevenueManagementPage({
  searchParams
}: {
  searchParams?: {
    revenue?: string;
    page?: string;
    limit?: string;
  };
}) {
  const revenues =
    searchParams?.revenue === 'user' ? await api.Revenue.getRevenueByUser() : await api.Revenue.getRevenueByDate();
  return <RevenueManagementPageClient revenues={revenues} searchParams={searchParams} />;
}
