import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng nhập',
  description: 'Đăng nhập vào tài khoản của bạn',
  robots: {
    index: false,
    follow: false
  }
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
