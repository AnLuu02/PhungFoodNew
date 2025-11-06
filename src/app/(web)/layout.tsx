import { Box } from '@mantine/core';
import FloatingWidget from '~/components/FloatingWidget';
import FooterWeb from '~/components/Web/Footer/FooterWeb';
import HeaderWeb from '~/components/Web/Header/HeaderWeb';
import { HeaderClient } from '~/components/Web/Header/section/HeaderFirst';
import ServiceComponent from '~/components/Web/Home/components/ServiceComponent';
import { GlobalModal } from '~/contexts/GlobalModal';
import { withRedisCache } from '~/lib/CacheConfig/withRedisCache';
import { api } from '~/trpc/server';

const getInitRestaurant = async () => {
  return await withRedisCache('get-one-active-client', () => api.Restaurant.getOneActiveClient(), 60 * 60 * 24);
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const restaurant = await getInitRestaurant();
  return (
    <>
      <Box p={0} m={0}>
        <>
          <HeaderClient />
          <HeaderWeb />
        </>
        <Box px={{ base: 10, sm: 30, md: 30, lg: 130 }} mt={'md'}>
          {children}
        </Box>
        <Box pl={{ base: 20, lg: 130 }} pr={{ base: 20, lg: 130 }}>
          <ServiceComponent />
        </Box>
        <FloatingWidget restaurant={restaurant} />
        <FooterWeb restaurant={restaurant} />
        <GlobalModal />
      </Box>
    </>
  );
};

export default Layout;
