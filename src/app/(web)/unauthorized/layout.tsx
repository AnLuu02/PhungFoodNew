import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Không có quyền',
  description: 'Không có quyền truy cập'
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
