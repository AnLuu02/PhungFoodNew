'use client';
import { Box, Button, Drawer, Flex, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconFilter } from '@tabler/icons-react';
import { useState } from 'react';
import { breakpoints } from '~/constants';
import { PriceRangeFilter } from './Filter/PriceRangeFilter';
import { SortFilter } from './Filter/SortFilter';
import { SidebarFilterContent } from './SidebarFilterContent';

export function SidebarMenu({ categories, materials }: any) {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.xs}px)`);
  if (isMobile) {
    return (
      <>
        <Flex align='center' justify='space-between' mt={'md'}>
          <Button
            leftSection={<IconFilter size={16} />}
            onClick={() => setDrawerOpened(true)}
            variant='outline'
            className='border-mainColor text-mainColor'
          >
            Lọc sản phẩm
          </Button>

          <PriceRangeFilter />
          <SortFilter />
        </Flex>
        <Drawer
          opened={drawerOpened}
          onClose={() => setDrawerOpened(false)}
          size='100%'
          title={
            <Title order={3} className='font-quicksand'>
              Danh mục & Bộ lọc
            </Title>
          }
          classNames={{
            header: 'bg-mainColor text-white',
            title: 'text-white'
          }}
        >
          <SidebarFilterContent categories={categories} materials={materials} />
        </Drawer>
      </>
    );
  }

  return (
    <Box className='h-full w-72 border-r bg-white dark:bg-dark-background'>
      <SidebarFilterContent categories={categories} materials={materials} />
    </Box>
  );
}
