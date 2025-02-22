import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Khuyến mãi',
  description: 'Khuyến mãi'
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
