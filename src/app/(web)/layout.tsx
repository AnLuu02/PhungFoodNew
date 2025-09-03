import { Box } from '@mantine/core';
import FloatingWidget from '~/components/FloatingWidget';
import FooterWeb from '~/components/Web/Footer/FooterWeb';
import HeaderWeb from '~/components/Web/Header/HeaderWeb';
import ServiceComponent from '~/components/Web/Home/components/ServiceComponent';
import { GlobalModal } from '~/contexts/GlobalModal';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Box p={0} m={0}>
        <HeaderWeb />
        <Box px={{ base: 10, sm: 30, md: 30, lg: 130 }} mt={'md'}>
          {children}
        </Box>
        <Box pl={{ base: 20, lg: 130 }} pr={{ base: 20, lg: 130 }}>
          <ServiceComponent />
        </Box>
        <FloatingWidget />
        <FooterWeb />
        <GlobalModal />
      </Box>
    </>
  );
};

export default Layout;
