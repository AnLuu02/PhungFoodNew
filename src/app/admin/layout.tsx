import { Metadata } from 'next';
import LayoutAdmin from './LayoutAdmin';

export const revalidate = 60 * 60;
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: {
    default: 'Tổng quan ',
    absolute: 'Tổng quan',
    template: '%s | ADMIN DASHBOARD'
  }
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <LayoutAdmin children={children} />;
}
