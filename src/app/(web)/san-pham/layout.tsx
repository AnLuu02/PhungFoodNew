import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chi tiết sản phẩm',
  description: 'Chi tiết sản phẩm'
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
