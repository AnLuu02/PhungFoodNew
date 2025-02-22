import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gọi món nhanh',
  description: 'Gọi món nhanh'
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
