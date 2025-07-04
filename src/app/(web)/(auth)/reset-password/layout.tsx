import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đặt lại mật khẩu',
  description: 'Nhập email để nhận liên kết đặt lại mật khẩu',
  robots: {
    index: false,
    follow: false
  }
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
