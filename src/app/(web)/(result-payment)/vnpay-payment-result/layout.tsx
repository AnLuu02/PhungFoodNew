import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kết quả thanh toán',
  description: 'Kết quả thanh toán'
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
