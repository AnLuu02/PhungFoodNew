'use client';

import {
  Box,
  Center,
  Divider,
  Grid,
  GridCol,
  Image,
  Paper,
  ScrollAreaAutosize,
  Stack,
  Tabs,
  Text,
  Title
} from '@mantine/core';
import { ImageType } from '@prisma/client';
import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import Empty from '~/app/_components/Empty';
import { getImageProduct } from '~/app/lib/utils/func-handler/getImageProduct';

const bestSellerProducts = [
  {
    title: 'Viên uống NutriGrow Nutrimed bổ sung canxi, vitamin D3',
    image: '/images/png/momo.png'
  },
  {
    title: 'Siro ống uống Canxi-D3-K2 5ml Kingphar bổ sung canxi',
    image: '/images/png/momo.png'
  },
  {
    title: 'Siro Brauer Baby Kids D3+K2 High Potency MK-7 Drops',
    image: '/images/png/momo.png'
  },
  {
    title: 'Viên uống Omexxel 3-6-9 Premium hỗ trợ tốt cho não và tim mạch',
    image: '/images/png/momo.png'
  },
  {
    title: 'Viên uống hỗ trợ phụ nữ mang thai và phụ nữ cho con bú',
    image: '/images/png/momo.png'
  }
];
export function MegaMenu({ categories }: any) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(categories?.[0]?.tag as string);
  const bestSellerProducts = categories.flatMap((item: any) =>
    hoveredTab === item?.tag ? item?.subCategory.flatMap((subItem: any) => subItem?.product) : []
  );
  // .filter((item: any, index: number) => index < 5 && item?.soldQuantity > 20);

  return (
    <Tabs
      defaultValue={categories?.[0]?.tag}
      variant='pills'
      value={hoveredTab}
      onChange={setHoveredTab}
      classNames={{
        tab: 'w-full justify-start rounded-md p-3 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-600'
      }}
    >
      <Box h={'70vh'} className='flex bg-gray-100'>
        <Box className='w-80 bg-white p-4 shadow-sm'>
          <Box className='mb-5'>
            <Title order={1} className='flex items-center gap-2 font-quicksand text-xl font-bold text-blue-600'>
              <Box className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600'>
                <Box className='text-2xl'>🍕</Box>
              </Box>
              Danh mục nổi bât
            </Title>
          </Box>
          <ScrollAreaAutosize mah={'55vh'} scrollbarSize={5}>
            <Tabs.List>
              {categories?.length > 0 &&
                categories?.map((item: any) => (
                  <Tabs.Tab
                    value={item.tag}
                    key={item.id}
                    onMouseEnter={() => setHoveredTab(item.tag)}
                    leftSection={
                      <Image
                        loading='lazy'
                        src={item?.subCategory?.[0]?.image?.url || '/images/png/momo.png'}
                        alt={item.image?.altText}
                        w={30}
                        h={30}
                      />
                    }
                  >
                    <Link key={item.title} href={`/thuc-don?danh-muc=${item.tag}`}>
                      <Text size='md' className='text-gray-700' fw={600}>
                        {item.name}
                      </Text>
                    </Link>
                  </Tabs.Tab>
                ))}
            </Tabs.List>
          </ScrollAreaAutosize>
        </Box>

        <ScrollAreaAutosize mih={'50vh'} className='flex-1' scrollbarSize={5}>
          {categories?.length > 0 &&
            categories?.map((item: any) => (
              <Tabs.Panel value={item.tag}>
                <Box p={'lg'}>
                  <Box mb={'xs'} className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {item?.subCategory?.map((category: any) => (
                      <Link
                        key={category.id}
                        href={`/thuc-don?danh-muc=${item.tag}&loai-san-pham=${category.tag}`}
                        className='flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md'
                      >
                        <Image
                          src={category.image?.url}
                          alt={category.name}
                          w={60}
                          h={60}
                          className='h-16 w-16 object-contain'
                        />
                        <Text size='sm' className='font-medium text-gray-800'>
                          {category.name}
                        </Text>
                      </Link>
                    ))}
                  </Box>
                  <Divider />
                  <Box>
                    <Box className='flex items-center justify-between'>
                      <h2 className='text-xl font-bold'>Bán chạy nhất {item.title} </h2>
                      <Link
                        href='/thuc-don?loai=san-pham-ban-chay'
                        className='flex items-center text-blue-600 hover:underline'
                      >
                        <Text size='sm' fw={700}>
                          <Center>
                            Xem tất cả <IconChevronRight size={16} />
                          </Center>
                        </Text>
                      </Link>
                    </Box>

                    <Grid>
                      {bestSellerProducts?.length > 0 ? (
                        bestSellerProducts?.map((product: any) => (
                          <GridCol span={3}>
                            <Link key={product.id} href='#'>
                              <Stack gap={0}>
                                <Paper
                                  withBorder
                                  w={120}
                                  h={120}
                                  radius={'md'}
                                  className='overflow-hidden border border-transparent p-1 transition-all hover:border-red-500'
                                >
                                  <Image
                                    src={getImageProduct(product?.images, ImageType.THUMBNAIL) || '/placeholder.svg'}
                                    alt={product.name}
                                    w={'100%'}
                                    h={'100%'}
                                  />
                                </Paper>
                                <h3 className='line-clamp-2 text-sm font-medium text-gray-800'>
                                  {product.description}
                                </h3>
                              </Stack>
                            </Link>
                          </GridCol>
                        ))
                      ) : (
                        <Empty
                          hasButton={false}
                          size='md'
                          title='Không có sản phẩm phù hợp'
                          content='Vui lòng quay lại sau'
                        />
                      )}
                    </Grid>
                  </Box>
                </Box>
              </Tabs.Panel>
            ))}
        </ScrollAreaAutosize>
      </Box>
    </Tabs>
  );
}
