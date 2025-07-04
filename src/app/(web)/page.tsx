import { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import HomeWeb from '~/components/Web/Home/HomeWeb';
import { withRedisCache } from '~/lib/cache/withRedisCache';
import { api } from '~/trpc/server';
export const metadata: Metadata = {
  title: 'Phụng Food - Đặc sản miền Tây chính gốc Cà Mau, Long An',
  description: 'Phụng Food chuyên cung cấp món ăn truyền thống miền Tây, đặc sản Cà Mau và Long An, giao hàng tận nơi.'
};
const getDataHomePage = unstable_cache(
  async () => {
    const redisKey = `home-page-data`;
    return withRedisCache(
      redisKey,
      async () => {
        return await api.Layout.getDataHomePage();
      },
      60 * 60 * 24
    );
  },
  ['home-page-data'],
  {
    revalidate: 60 * 60 * 24
  }
);
const HomePage = async () => {
  const data = await getDataHomePage();
  return <HomeWeb data={data} />;
};

export default HomePage;
