import { Box, Grid, GridCol } from '@mantine/core';
import { Metadata } from 'next';
import { defaultProductFilters } from '~/shared/schema/product.filter.schema';
import { api, HydrateClient } from '~/trpc/server';
import { CartFloating } from './components/CartFloating';
import { SidebarMenu } from './components/SidebarMenu';

export const dynamic = 'force-static';
export const revalidate = 60 * 60;

export const metadata: Metadata = {
  title: 'Thực đơn - Phụng Food',
  description: 'Thực đơn đa dạng với các món ngon đặc trưng miền Tây, được chế biến tại Phụng Food.'
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  await Promise.allSettled([
    api.Category.getCategoriesWithRelationBasic.prefetch(),
    api.Material.getAll.prefetch(),
    api.Product.find.prefetch(defaultProductFilters, { staleTime: 30_000 })
  ]);

  return (
    <HydrateClient>
      <Box className='relative' w={'100%'}>
        <Grid columns={24}>
          <GridCol span={{ base: 24, sm: 8, lg: 6 }} className='h-fit animate-fadeUp overflow-hidden'>
            <SidebarMenu />
          </GridCol>
          <GridCol
            span={{ base: 24, sm: 16, lg: 18 }}
            className='h-fit animate-fadeUp'
            style={{ animationDuration: '0.75s' }}
          >
            {children}
          </GridCol>
        </Grid>
      </Box>
      <CartFloating />
    </HydrateClient>
  );
};

export default Layout;
