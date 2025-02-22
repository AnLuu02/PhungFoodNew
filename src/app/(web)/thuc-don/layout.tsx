import { Box, Grid, GridCol, rem } from '@mantine/core';
import { Metadata } from 'next';
import { CategoryNav } from './_components/CatgoryNavbar';

export const metadata: Metadata = {
  title: 'Thực đơn',
  description: 'Thực đơn'
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box className='relative' w={'100%'}>
      <Grid gutter={rem(30)} columns={24}>
        <GridCol span={{ base: 24, sm: 24, md: 8, lg: 6 }} className='overflow-hidden'>
          <CategoryNav />
        </GridCol>
        <GridCol span={{ base: 24, sm: 24, md: 16, lg: 18 }}>{children}</GridCol>
      </Grid>
    </Box>
  );
};

export default Layout;
