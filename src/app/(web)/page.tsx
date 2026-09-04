import { Box } from '@mantine/core';
import { Metadata } from 'next';
import HomeWeb from '~/components/Web/Home/HomeWeb';
import { withRedisCache } from '~/lib/CacheConfig/withRedisCache';
import { PAGE_KEY } from '~/shared/constants/redis-keys';
import { api } from '~/trpc/server';

export const revalidate = 60 * 60;
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Trang chủ - Phụng Food',
  description: 'Phụng Food chuyên cung cấp món ăn truyền thống miền Tây, đặc sản Cà Mau và Long An, giao hàng tận nơi.'
};

const getInit = async () => {
  try {
    return await withRedisCache(PAGE_KEY.home, () => api.Page.getInit(), 60 * 60);
  } catch {
    return await api.Page.getInit();
  }
};

const HomePage = async () => {
  const data = await getInit();

  return (
    <Box className='relative w-full overflow-hidden'>
      <HomeWeb banners={data?.banners} categories={data?.categories} />;
    </Box>
  );
};

export default HomePage;
