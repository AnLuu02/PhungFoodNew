'use client';
import { Accordion, Box, Button, Paper, Stack, Text } from '@mantine/core';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export const MenuCategoryFilter = ({ categories }: any) => {
  const params = useSearchParams();
  return (
    <Paper shadow='md' className='h-[max-content] rounded-md border-mainColor' mt={{ base: 'xs', md: 0 }} mb={20}>
      <Box className='rounded-t-md bg-mainColor p-2 text-white'>
        <Text size='sm' fw={700}>
          DANH MỤC SẢN PHẨM
        </Text>
      </Box>
      <Accordion p={0}>
        <Link className='h-full w-full' href={`/thuc-don`}>
          <Button
            w={'100%'}
            h={'100%'}
            radius={0}
            py={'xs'}
            variant='subtle'
            className='bg-subColor text-black transition-all duration-200 ease-in-out hover:bg-mainColor hover:text-white'
          >
            Tất cả
          </Button>
        </Link>
        {categories.map((category: any) => (
          <Accordion.Item key={category?.id} value={category?.name}>
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
            <Accordion.Panel>
              <Stack gap='xs'>
                {category.subCategory.map((item: any) => (
                  <Link
                    key={item?.id}
                    className='h-full w-full'
                    href={`/thuc-don?danh-muc=${category.tag}&loai-san-pham=${item.tag}`}
                  >
                    <Button
                      fullWidth
                      py={'xs'}
                      key={item?.id}
                      variant='subtle'
                      className={`bg-mainColor transition-all duration-200 ease-in-out hover:bg-subColor hover:text-black ${item.tag === params.get('loai-san-pham') ? 'bg-subColor text-black' : 'text-white'} `}
                    >
                      {item?.name} ({item?.product?.length || 0})
                    </Button>
                  </Link>
                ))}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Paper>
  );
};
