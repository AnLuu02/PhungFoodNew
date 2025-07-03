import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng ký',
  description: 'Đăng ký tài khoản mới',
  robots: {
    index: false,
    follow: false
  }
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
