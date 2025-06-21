import { Box, rem } from '@mantine/core';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import { api } from '~/trpc/server';
import HomeWeb from './_components/Web/Home/HomeWeb';
import { withRedisCache } from './lib/utils/func-handler/withRedisCache';

export const revalidate = 60 * 60 * 24;

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
  try {
    return (
      <Box className='w-full' pl={{ base: rem(20), lg: rem(130) }} pr={{ base: rem(20), lg: rem(130) }}>
        <HomeWeb data={data} />
      </Box>
    );
  } catch (error) {
    console.error('Failed to load page data:', error);
    return notFound();
  }
};

export default HomePage;
