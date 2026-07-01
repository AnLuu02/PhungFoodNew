import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/server/auth/options';
import { db } from '~/server/db';
import { getFilterFavouriteFoodService } from '~/server/services/favouriteFood.service';
import FavouritePageClient from './pageClient';

export const metadata: Metadata = {
  title: 'Sản phẩm yêu thích - Phụng Food',
  description:
    'Xem các sản phẩm yêu thích của bạn tại Phụng Food. Lưu và quản lý món ăn bạn yêu thích để đặt hàng dễ dàng hơn.'
};
const FavouriteFoodPage = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const favourites = await getFilterFavouriteFoodService(db, {
    keys: userId ? [userId] : []
  });
  return <FavouritePageClient favourites={favourites} userId={userId} />;
};

export default FavouriteFoodPage;
