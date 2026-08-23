'use client';
import { Accordion, Box, Button, Card, Center, Divider, Paper, ScrollArea, Stack, Text } from '@mantine/core';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CategoryBasic } from '~/shared/type-trpc/category.type-trpc';
import { api } from '~/trpc/react';
import { MaterialFilter } from './Filter/MaterialFilter';
import { PriceCheckedFilter } from './Filter/PriceCheckedFilter';
import { FilterRating } from './Filter/RatingFilter';
export function SidebarFilterContent() {
  const { data, isLoading } = api.Category.getCategoriesWithRelationBasic.useQuery();
  const params = useSearchParams();

  const categories = data ?? [];
  return (
    <>
      <Card p={0} className='bg-gray-100 dark:bg-dark-card' mt={{ base: 'xs', md: 0 }} mb={20}>
        <Box className='rounded-t-md bg-mainColor p-2 text-white'>
          <Text size='sm' fw={700}>
            DANH MỤC SẢN PHẨM
          </Text>
        </Box>
        <Accordion p={0} defaultValue={params.get('danh-muc')}>
          <Link className='h-full w-full' href={`/thuc-don`}>
            <Button
              w={'100%'}
              h={'100%'}
              radius={0}
              py={'xs'}
              variant='subtle'
              className='bg-subColor text-black transition-all duration-200 ease-in-out hover:border-t hover:border-solid hover:border-transparent hover:border-t-white hover:bg-mainColor hover:text-white'
            >
              Tất cả
            </Button>
          </Link>
          {categories.map((category: CategoryBasic) => (
            <Accordion.Item key={category?.id} value={category?.tag}>
              <Accordion.Control
                className={`${
                  params.get('danh-muc') === category.tag ||
                  category.subCategory.some(
                    (item: CategoryBasic['subCategory'][number]) => item.tag === params.get('loai-san-pham')
                  )
                    ? 'text-mainColor'
                    : ''
                }`}
              >
                <Text
                  size='sm'
                  fw={
                    params.get('danh-muc') === category.tag ||
                    category.subCategory.some(
                      (item: CategoryBasic['subCategory'][number]) => item.tag === params.get('loai-san-pham')
                    )
                      ? 900
                      : 500
                  }
                >
                  {category?.name} ({category?.subCategory?.length || 0})
                </Text>
              </Accordion.Control>
              <Accordion.Panel pl={'md'}>
                <Box className={`border-0 border-l border-solid border-gray-300 pl-2`}>
                  {category.subCategory?.length > 0 ? (
                    category.subCategory.map((item: CategoryBasic['subCategory'][number]) => (
                      <Link key={item.name} href={`/thuc-don?danh-muc=${category.tag}&loai-san-pham=${item.tag}`}>
                        <Paper
                          key={item.name}
                          py={'xs'}
                          pl={'md'}
                          w={'100%'}
                          className={`${item.tag === params.get('loai-san-pham') ? 'bg-mainColor/10' : ''} m-0 my-1 hover:bg-mainColor/10`}
                        >
                          <Text size='sm' fw={700}>
                            {item?.name}
                          </Text>
                        </Paper>
                      </Link>
                    ))
                  ) : (
                    <Text size='sm' fw={700}>
                      Chưa có loại sản phẩm
                    </Text>
                  )}
                </Box>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Card>

      <Card p={0} className='bg-gray-100 dark:bg-dark-card'>
        <Box className='rounded-t-md bg-mainColor p-2 text-white'>
          <Text size='sm' fw={700}>
            BỘ LỌC SẢN PHẨM
          </Text>
        </Box>
        <ScrollArea className='flex-grow' px={'sm'}>
          <Stack className='mt-4' gap={'md'} px={'xs'}>
            <PriceCheckedFilter />
            <Divider p={0} m={0} />
            <MaterialFilter />
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
