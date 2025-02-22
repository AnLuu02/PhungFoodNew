import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thông tin khách hàng',
  description: 'Thông tin khách hàng'
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
