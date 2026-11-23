import { Box } from '@mantine/core';
import FloatingWidget from '~/components/common/floating-widget';
import { ServiceRestaurantSection } from '~/components/domain/service-restaurant-section';
import FooterWeb from '~/components/web/footer/footer-web';
import { NavigationFixed } from '~/components/web/header/components/navigation-fixed';
import HeaderWeb from '~/components/web/header/header-web';
import { HeaderClient } from '~/components/web/header/sections/header-first';
import { withRedisCache } from '~/lib/config/cache/with-redis-cache';
import { RESTAURANT_KEY } from '~/shared/constants/redis-keys';
import { api } from '~/trpc/server';

const getInitRestaurant = async () => {
  return await withRedisCache(RESTAURANT_KEY.active, () => api.Restaurant.getBaseActiveClient(), 60 * 60 * 24);
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const restaurant = await getInitRestaurant();
  return (
    <>
      <HeaderClient restaurant={restaurant} />
      <HeaderWeb />
      <Box className='relative w-full pb-[70px] sm:pb-0'>
        <Box px={{ base: 10, sm: 30, md: 30, lg: 130 }} mt={'md'}>
          {children}
        </Box>
        <Box px={{ base: 20, lg: 130 }}>
          <ServiceRestaurantSection />
        </Box>
        <FloatingWidget restaurant={restaurant} />
        <FooterWeb restaurant={restaurant} />
      </Box>
      <NavigationFixed />
    </>
  );
};

export default Layout;
