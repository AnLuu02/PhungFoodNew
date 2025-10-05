'use client';
import { Box, Button, Divider, Drawer, Flex, Paper, ScrollArea, Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconFilter } from '@tabler/icons-react';
import { useState } from 'react';
import { breakpoints } from '~/constants';
import { MaterialFilter } from './Filter/MaterialFilter';
import { MenuCategoryFilter } from './Filter/MenuCategoryFilter';
import { PriceCheckedFilter } from './Filter/PriceCheckedFilter';
import { PriceRangeFilter } from './Filter/PriceRangeFilter';
import { SortFilter } from './Filter/SortFilter';

export default function ContentSidebarMenu({ categories, materials }: any) {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.xs}px)`);

  const content = (
    <>
      <MenuCategoryFilter categories={categories} materials={materials} />
      <Paper shadow='md' className='border-1 rounded-md border-mainColor' h={'max-content'} pb={'md'}>
        <ScrollArea className='flex-grow'>
          <Box className='rounded-t-md bg-mainColor p-2 text-white'>
            <Text size='sm' fw={700}>
              BỘ LỌC SẢN PHẨM
            </Text>
          </Box>
          <Stack className='mt-4' gap={'md'} px={'xs'}>
            <PriceCheckedFilter />
            <Divider p={0} m={0} />
            <MaterialFilter materials={materials} />
          </Stack>
        </ScrollArea>
      </Paper>
    </>
  );

  if (isMobile) {
    return (
      <>
        <Flex align='center' justify='space-between' mt={'md'}>
          <Button
            leftSection={<IconFilter size={16} />}
            onClick={() => setDrawerOpened(true)}
            variant='outline'
            className='text-mainColor'
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
          title='Danh mục & Bộ lọc'
          classNames={{
            header: 'bg-mainColor text-white',
            title: 'text-white'
          }}
        >
          {content}
        </Drawer>
      </>
    );
  }

  return <Box className='h-full w-72 border-r bg-white dark:bg-dark-background'>{content}</Box>;
}
