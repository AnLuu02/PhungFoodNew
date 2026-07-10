import { Metadata } from 'next';
import FavouritePageClient from './pageClient';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Sản phẩm yêu thích - Phụng Food',
  description:
    'Xem các sản phẩm yêu thích của bạn tại Phụng Food. Lưu và quản lý món ăn bạn yêu thích để đặt hàng dễ dàng hơn.'
};
const FavouriteFoodPage = async () => {
  return <FavouritePageClient />;
};

export default FavouriteFoodPage;
