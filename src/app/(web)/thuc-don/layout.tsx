import { Box, Grid, GridCol } from '@mantine/core';
import { Metadata } from 'next';
import { api } from '~/trpc/server';
import { CartFloating } from './components/CartFloating';
import { SidebarMenu } from './components/SidebarMenu';

export const metadata: Metadata = {
  title: 'Thực đơn - Phụng Food',
  description: 'Thực đơn đa dạng với các món ngon đặc trưng miền Tây, được chế biến tại Phụng Food.'
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const [categories, materials] = await Promise.allSettled([api.Category.getAll(), api.Material.getAll()]);

  return (
    <>
      <Box className='relative' w={'100%'}>
        <Grid columns={24}>
          <GridCol span={{ base: 24, sm: 8, lg: 6 }} className='h-fit animate-fadeUp overflow-hidden'>
            <SidebarMenu
              materials={materials.status === 'fulfilled' ? materials.value : []}
              categories={categories.status === 'fulfilled' ? categories.value : []}
            />
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
    </>
  );
};

export default Layout;
