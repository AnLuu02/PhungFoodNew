import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/server/auth/options';
import { api } from '~/trpc/server';
import FavouritePageClient from './pageClient';

export const metadata: Metadata = {
  title: 'Sản phẩm yêu thích - Phụng Food',
  description:
    'Xem các sản phẩm yêu thích của bạn tại Phụng Food. Lưu và quản lý món ăn bạn yêu thích để đặt hàng dễ dàng hơn.'
};
const FavouriteFoodPage = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const favourites = await api.FavouriteFood.getFilter({
    keys: userId ? [userId] : []
  });
  return <FavouritePageClient favourites={favourites} />;
};

export default FavouriteFoodPage;
