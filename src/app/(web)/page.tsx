import { Metadata } from 'next';
import HomeWeb from '~/components/Web/Home/HomeWeb';
import { withRedisCache } from '~/lib/CacheConfig/withRedisCache';
import { api } from '~/trpc/server';

export const revalidate = 60 * 60;
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Trang chủ - Phụng Food',
  description: 'Phụng Food chuyên cung cấp món ăn truyền thống miền Tây, đặc sản Cà Mau và Long An, giao hàng tận nơi.'
};

const getInit = async () => {
  return await withRedisCache('home-web', () => api.Page.getInit(), 60 * 60);
};

const HomePage = async () => {
  const data = await getInit();
  return <HomeWeb data={data} />;
};

export default HomePage;
