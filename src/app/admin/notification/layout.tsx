import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Quản lý thông báo ',
    absolute: 'Quản lý thông báo',
    template: '%s | Quản lý thông báo'
  }
};
export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
