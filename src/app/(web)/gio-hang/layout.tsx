import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giỏ hàng',
  description: 'Giỏ hàng'
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
