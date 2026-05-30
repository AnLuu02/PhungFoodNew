import type { Metadata } from 'next';
import AnalyticsDashboard from './components/AnalyticsDashboard';

export const metadata: Metadata = {
  title: 'Analytics | Admin Dashboard',
  description: 'Trang phân tích dữ liệu bán hàng, đơn hàng và khách hàng'
};

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
}
