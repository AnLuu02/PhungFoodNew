'use client';
import { Drawer, Flex, Stack, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconFilter } from '@tabler/icons-react';
import { useState } from 'react';
import BButton from '~/components/Button/Button';
import { SearchInput } from '~/components/Search/SearchInput';
import { breakpoints } from '~/constants';
import { PriceRangeFilter } from './Filter/PriceRangeFilter';
import { SortFilter } from './Filter/SortFilter';
import { SidebarFilterContent } from './SidebarFilterContent';

export function SidebarMenu({ categories, materials }: any) {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.sm}px)`);
  if (isMobile) {
    return (
      <Stack mt={{ base: 0, sm: 'md' }} mb={{ base: 'md' }}>
        <Flex align='center' justify='space-between'>
          <BButton leftSection={<IconFilter size={16} />} onClick={() => setDrawerOpened(true)} variant='outline'>
            Lọc sản phẩm
          </BButton>
          <PriceRangeFilter />
          <SortFilter />
        </Flex>
        <SearchInput />
        <Drawer
          opened={drawerOpened}
          zIndex={10001}
          onClose={() => setDrawerOpened(false)}
          size='100%'
          title={
            <Title order={4} className='font-quicksand'>
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
      </Stack>
    );
  }

  return <SidebarFilterContent categories={categories} materials={materials} />;
}
