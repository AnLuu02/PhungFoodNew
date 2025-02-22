import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tin tức',
  description: 'Tin tức'
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
