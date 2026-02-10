'use client';
import { Accordion, Box, Button, Card, Text } from '@mantine/core';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CategoryAll } from '~/types/client-type-trpc';
type subCategoryFromCategoryAll = NonNullable<CategoryAll>[0]['subCategories'][0];
export const MenuCategoryFilter = ({ categories }: { categories: CategoryAll }) => {
  const params = useSearchParams();
  return (
    <Card p={0} className='rounded-md bg-gray-100 dark:bg-dark-card' mt={{ base: 'xs', md: 0 }} mb={20}>
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
        {categories.map(category => (
          <Accordion.Item key={category?.id} value={category?.tag}>
            <Accordion.Control
              className={`${
                params.get('danh-muc') === category.tag ||
                category.subCategories.some(
                  (item: subCategoryFromCategoryAll) => item.tag === params.get('loai-san-pham')
                )
                  ? 'text-mainColor'
                  : ''
              }`}
            >
              <Text
                size='sm'
                fw={
                  params.get('danh-muc') === category.tag ||
                  category.subCategories.some(
                    (item: subCategoryFromCategoryAll) => item.tag === params.get('loai-san-pham')
                  )
                    ? 900
                    : 500
                }
              >
                {category?.name} ({category?.subCategories?.length || 0})
              </Text>
            </Accordion.Control>
            <Accordion.Panel pl={'md'}>
              <Box className={`border-0 border-l border-solid border-gray-300 pl-2`}>
                {category.subCategories?.length > 0 ? (
                  category.subCategories.map((item: subCategoryFromCategoryAll) => (
                    <Link key={item.name} href={`/thuc-don?danh-muc=${category.tag}&loai-san-pham=${item.tag}`}>
                      <Box
                        key={item.name}
                        py={'xs'}
                        pl={'md'}
                        w={'100%'}
                        className={`${item.tag === params.get('loai-san-pham') ? 'bg-mainColor/10' : ''} my-1 rounded-md hover:bg-mainColor/10`}
                      >
                        <Text size='sm' fw={700}>
                          {item?.name} ({item?.products?.length || 0})
                        </Text>
                      </Box>
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
  );
};
