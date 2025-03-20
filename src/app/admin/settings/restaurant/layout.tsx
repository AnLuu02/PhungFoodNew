import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Quản lý cài đặt ',
    absolute: 'Quản lý cài đặt',
    template: '%s | Quản lý cài đặt'
  }
};
export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
