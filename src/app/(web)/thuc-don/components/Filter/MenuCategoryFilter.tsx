'use client';
import { Accordion, Box, Button, Paper, Text } from '@mantine/core';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export const MenuCategoryFilter = ({ categories }: any) => {
  const params = useSearchParams();
  return (
    <Paper shadow='md' className='rounded-md border-mainColor' mt={{ base: 'xs', md: 0 }} mb={20}>
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
        {categories.map((category: any) => (
          <Accordion.Item key={category?.id} value={category?.tag}>
            <Accordion.Control
              className={`${
                params.get('danh-muc') === category.tag ||
                category.subCategory.some((item: any) => item.tag === params.get('loai-san-pham'))
                  ? 'text-mainColor'
                  : ''
              }`}
            >
              <Text
                size='sm'
                fw={
                  params.get('danh-muc') === category.tag ||
                  category.subCategory.some((item: any) => item.tag === params.get('loai-san-pham'))
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
                  category.subCategory.map((item: any) => (
                    <Link key={item.name} href={`/thuc-don?danh-muc=${category.tag}&loai-san-pham=${item.tag}`}>
                      <Box
                        key={item.name}
                        py={'xs'}
                        pl={'md'}
                        w={'100%'}
                        className={`${item.tag === params.get('loai-san-pham') ? 'bg-mainColor/10' : ''} my-1 rounded-md hover:bg-mainColor/10`}
                      >
                        <Text size='sm' fw={700}>
                          {item?.name} ({item?.product?.length || 0})
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
    </Paper>
  );
};
