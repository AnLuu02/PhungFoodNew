import { Box } from '@mantine/core';
import FloatingWidget from '~/components/FloatingWidget';
import FooterWeb from '~/components/Web/Footer/footer-web';
import HeaderWeb from '~/components/Web/Header/HeaderWeb';
import ServiceComponent from '~/components/Web/Home/components/ServiceComponent';
import { GlobalModal } from '~/contexts/GlobalModal';
import { api } from '~/trpc/server';
export const revalidate = 60 * 60 * 24;
const Layout = async ({ children }: { children: React.ReactNode }) => {
  const restaurant = await api.Restaurant.getOneActive();
  return (
    <>
      <Box p={0} m={0}>
        <HeaderWeb restaurant={restaurant} />
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
