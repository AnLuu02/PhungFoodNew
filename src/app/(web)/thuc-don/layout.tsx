import { Box, Grid, GridCol } from '@mantine/core';
import { Metadata } from 'next';
import { api } from '~/trpc/server';
import { SidebarMenu } from './components/SidebarMenu';

export const metadata: Metadata = {
  title: 'Thực đơn - Phụng Food',
  description: 'Thực đơn đa dạng với các món ngon đặc trưng miền Tây, được chế biến tại Phụng Food.'
};
const Layout = async ({ children }: { children: React.ReactNode }) => {
  const [categories, materials] = await Promise.allSettled([api.Category.getAll(), api.Material.getAll()]);

  return (
    <Box className='relative' w={'100%'}>
      <Grid gutter={30} columns={24}>
        <GridCol span={{ base: 24, sm: 24, md: 8, lg: 6 }} className='h-fit overflow-hidden dark:bg-dark-background'>
          <SidebarMenu
            materials={materials.status === 'fulfilled' ? materials.value : []}
            categories={categories.status === 'fulfilled' ? categories.value : []}
          />
        </GridCol>
        <GridCol span={{ base: 24, sm: 24, md: 16, lg: 18 }} className='h-fit'>
          {children}
        </GridCol>
      </Grid>
    </Box>
  );
};

export default Layout;
