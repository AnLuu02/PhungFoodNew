'use client';
import { Drawer, Flex, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconFilter } from '@tabler/icons-react';
import { useState } from 'react';
import BButton from '~/components/Button/Button';
import { breakpoints } from '~/constants';
import { CategoryAll, MaterialAll } from '~/types/client-type-trpc';
import { PriceRangeFilter } from './Filter/PriceRangeFilter';
import { SortFilter } from './Filter/SortFilter';
import { SidebarFilterContent } from './SidebarFilterContent';

export function SidebarMenu({ categories, materials }: { categories: CategoryAll; materials: MaterialAll }) {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.xs}px)`);
  if (isMobile) {
    return (
      <>
        <Flex align='center' justify='space-between' mt={'md'}>
          <BButton leftSection={<IconFilter size={16} />} onClick={() => setDrawerOpened(true)} variant='outline'>
            Lọc sản phẩm
          </BButton>
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

  return <SidebarFilterContent categories={categories} materials={materials} />;
}
