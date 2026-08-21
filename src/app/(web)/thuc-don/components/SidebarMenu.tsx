'use client';
import { Box, Button, Drawer, Flex, Stack, Title } from '@mantine/core';
import { IconFilter } from '@tabler/icons-react';
import { useState } from 'react';
import { SearchInput } from '~/components/Search/SearchInput';
import { PriceRangeFilter } from './Filter/PriceRangeFilter';
import { SortFilter } from './Filter/SortFilter';
import { SidebarFilterContent } from './SidebarFilterContent';

export function SidebarMenu() {
  const [drawerOpened, setDrawerOpened] = useState(false);

  return (
    <>
      <Stack mt={{ base: 0, sm: 'md' }} mb={{ base: 'md' }} className='md:hidden'>
        <Flex align='center' justify='space-between'>
          <Button leftSection={<IconFilter size={16} />} onClick={() => setDrawerOpened(true)} variant='outline'>
            Lọc sản phẩm
          </Button>
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
          <SidebarFilterContent />
        </Drawer>
      </Stack>

      <Box className='hidden md:block'>
        <SidebarFilterContent />
      </Box>
    </>
  );
}
