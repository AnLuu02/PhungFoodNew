import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đơn hàng của bạn',
  description: 'Đơn hàng của bạn'
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
