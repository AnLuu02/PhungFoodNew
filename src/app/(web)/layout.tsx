import { Box } from '@mantine/core';
import FloatingWidget from '~/components/FloatingWidget';
import FooterWeb from '~/components/Web/Footer/FooterWeb';
import { NavigationFixed } from '~/components/Web/Header/components/NavigationFIxed';
import HeaderWeb from '~/components/Web/Header/HeaderWeb';
import { HeaderClient } from '~/components/Web/Header/section/HeaderFirst';
import ServiceComponent from '~/components/Web/Home/components/ServiceComponent';
import { withRedisCache } from '~/lib/CacheConfig/withRedisCache';
import { api, HydrateClient } from '~/trpc/server';

const getInitRestaurant = async () => {
  return await withRedisCache('get-one-active-client', () => api.Restaurant.getOneActiveClient(), 60 * 60 * 24);
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const restaurant = await getInitRestaurant();
  void api.Restaurant.getOneActiveClient.prefetch(undefined, {
    initialData: restaurant
  });
  return (
    <HydrateClient>
      <>
        <HeaderClient />
        <HeaderWeb />
        <Box className='relative w-full overflow-x-hidden pb-[70px] sm:pb-0'>
          <Box px={{ base: 10, sm: 30, md: 30, lg: 130 }} mt={'md'}>
            {children}
          </Box>
          <Box px={{ base: 20, lg: 130 }}>
            <ServiceComponent />
          </Box>
          <FloatingWidget restaurant={restaurant} />
          <FooterWeb restaurant={restaurant} />
        </Box>
        <NavigationFixed />
      </>
    </HydrateClient>
  );
};

export default Layout;
