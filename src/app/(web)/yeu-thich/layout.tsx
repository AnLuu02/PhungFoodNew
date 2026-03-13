import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/server/auth/options';
import { api } from '~/trpc/server';

export const dynamic = 'force-static';
export const revalidate = 60 * 60 + 24;

export const metadata: Metadata = {
  title: 'Sản phẩm yêu thích - Phụng Food',
  description:
    'Xem các sản phẩm yêu thích của bạn tại Phụng Food. Lưu và quản lý món ăn bạn yêu thích để đặt hàng dễ dàng hơn.'
};
const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  void api.FavouriteFood.getFilter.prefetch({
    s: session?.user?.email || ''
  });
  return <>{children}</>;
};

export default Layout;
