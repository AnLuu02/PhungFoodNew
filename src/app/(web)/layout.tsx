import { Box, rem } from '@mantine/core';
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
        <Box
          pl={{ base: rem(10), sm: rem(30), md: rem(30), lg: rem(130) }}
          pr={{ base: rem(10), sm: rem(30), md: rem(30), lg: rem(130) }}
          mt={'md'}
        >
          {children}
        </Box>
        <Box pl={{ base: rem(20), lg: rem(130) }} pr={{ base: rem(20), lg: rem(130) }}>
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
