import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sản phẩm yêu thích - Phụng Food',
  description:
    'Xem các sản phẩm yêu thích của bạn tại Phụng Food. Lưu và quản lý món ăn bạn yêu thích để đặt hàng dễ dàng hơn.'
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
