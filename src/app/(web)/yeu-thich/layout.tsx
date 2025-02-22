import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Yêu thích',
  description: 'Yêu thích'
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
