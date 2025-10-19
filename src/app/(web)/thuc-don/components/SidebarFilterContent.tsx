'use client';
import { Box, Card, Center, Divider, ScrollArea, Stack, Text } from '@mantine/core';
import { MaterialFilter } from './Filter/MaterialFilter';
import { MenuCategoryFilter } from './Filter/MenuCategoryFilter';
import { PriceCheckedFilter } from './Filter/PriceCheckedFilter';
import { FilterRating } from './Filter/RatingFilter';

export function SidebarFilterContent({ categories, materials }: any) {
  return (
    <>
      <MenuCategoryFilter categories={categories} materials={materials} />
      <Card p={0} className='rounded-md bg-gray-100 dark:bg-dark-card'>
        <Box className='rounded-t-md bg-mainColor p-2 text-white'>
          <Text size='sm' fw={700}>
            BỘ LỌC SẢN PHẨM
          </Text>
        </Box>
        <ScrollArea className='flex-grow' px={'sm'}>
          <Stack className='mt-4' gap={'md'} px={'xs'}>
            <PriceCheckedFilter />
            <Divider p={0} m={0} />
            <MaterialFilter materials={materials} />
            <Divider p={0} m={0} />
            <FilterRating />
          </Stack>
        </ScrollArea>
        <Center mb={'sm'} mt={'xl'}>
          <Text size='xs' c={'dimmed'}>
            © 2025 PhungFood. All rights reserved.
          </Text>
        </Center>
      </Card>
    </>
  );
}
