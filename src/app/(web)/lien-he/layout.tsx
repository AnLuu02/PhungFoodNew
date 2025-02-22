import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Liên hệ với chúng tôi',
  description: 'Liên hệ với chúng tôi'
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
