import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giỏ hàng - Phụng Food',
  description: 'Quản lý giỏ hàng của bạn tại Phụng Food. Xem, chỉnh sửa và thanh toán đơn hàng của bạn.'
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
