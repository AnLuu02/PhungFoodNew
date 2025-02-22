import { Box, rem } from '@mantine/core';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      pl={{ base: rem(10), sm: rem(50), md: rem(30), lg: rem(130) }}
      pr={{ base: rem(10), sm: rem(50), md: rem(30), lg: rem(130) }}
      pt={20}
    >
      {children}
    </Box>
  );
};

export default Layout;
