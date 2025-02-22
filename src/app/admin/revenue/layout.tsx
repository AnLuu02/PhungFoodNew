import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Quản lý doanh thu ',
    absolute: 'Quản lý doanh thu',
    template: '%s | Quản lý doanh thu'
  }
};
export default function RevenueLayout({ children }: { children: React.ReactNode }) {
  return { children };
}
