import { Box, Grid, GridCol } from '@mantine/core';
import { Metadata } from 'next';
import SidebarMenu from './components/SidebarMenu';

export const metadata: Metadata = {
  title: 'Thực đơn món ăn miền Tây | Phụng Food',
  description: 'Thực đơn đa dạng với các món ngon đặc trưng miền Tây, được chế biến tại Phụng Food.'
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box className='relative' w={'100%'}>
      <Grid gutter={30} columns={24}>
        <GridCol span={{ base: 24, sm: 24, md: 8, lg: 6 }} className='overflow-hidden dark:bg-dark-background'>
          <SidebarMenu />
        </GridCol>
        <GridCol span={{ base: 24, sm: 24, md: 16, lg: 18 }}>{children}</GridCol>
      </Grid>
    </Box>
  );
};

export default Layout;
