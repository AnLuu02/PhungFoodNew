'use client';

import {
  Box,
  Card,
  Center,
  Divider,
  Grid,
  GridCol,
  Paper,
  ScrollAreaAutosize,
  Stack,
  Tabs,
  Text,
  Title,
  Tooltip
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import Empty from '~/components/Empty';
import { formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { getImageProduct } from '~/lib/func-handler/getImageProduct';
import { LocalImageType } from '~/lib/zod/EnumType';

export default function MegaMenu({ categories }: any) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(categories?.[0]?.tag as string);
  const bestSellerProducts = useMemo(() => {
    return categories.flatMap((item: any) =>
      hoveredTab === item?.tag ? item?.subCategory.flatMap((subItem: any) => subItem?.product) : []
    );
  }, [hoveredTab, categories]);
  return (
    <Tabs
      defaultValue={categories?.[0]?.tag}
      variant='pills'
      value={hoveredTab}
      onChange={setHoveredTab}
      classNames={{
        tab: 'data-[active=true]:text-maincolor w-full justify-start rounded-md p-3 data-[active=true]:bg-mainColor/10 dark:data-[active=true]:bg-dark-card dark:data-[active=true]:text-white'
      }}
    >
      <Box h={'70vh'} className='flex bg-gray-100 dark:bg-dark-background'>
        <Box className='w-80 bg-white p-4 shadow-sm dark:bg-dark-background'>
          <Box className='mb-5'>
            <Title
              order={1}
              className='flex items-center gap-2 font-quicksand text-xl font-bold text-mainColor dark:text-dark-text'
            >
              <Box className='flex h-10 w-10 items-center justify-center rounded-full bg-mainColor/10 text-mainColor dark:text-dark-text'>
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
                        width={30}
                        height={30}
                        style={{ objectFit: 'cover' }}
                      />
                    }
                  >
                    <Link key={item.title} href={`/thuc-don?danh-muc=${item.tag}`}>
                      <Text size='md' className='text-gray-700 dark:text-dark-text' fw={600}>
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
              <Tabs.Panel value={item.tag} key={item.id}>
                <Box p={'lg'}>
                  <Grid mb={'xs'}>
                    {item?.subCategory?.map((category: any) => (
                      <GridCol span={4} key={category.id}>
                        <Link
                          key={category.id}
                          href={`/thuc-don?danh-muc=${item.tag}&loai-san-pham=${category.tag}`}
                          className='dark:hover:shadow-md/80 flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm transition-all hover:scale-105 hover:shadow-md dark:bg-dark-card'
                        >
                          <Card
                            radius={'lg'}
                            withBorder
                            w={60}
                            h={60}
                            pos={'relative'}
                            className='flex items-center justify-center shadow-none'
                          >
                            <Image
                              loading='lazy'
                              src={category.image?.url || '/images/png/momo.png'}
                              alt={category.name}
                              width={50}
                              height={50}
                              style={{ borderRadius: 8, objectFit: 'cover' }}
                            />
                          </Card>
                          <Stack gap={2}>
                            <Text size='sm' fw={700} className='text-gray-800 dark:text-dark-text'>
                              {category.name}
                            </Text>
                            <Text size='xs' className='flex items-center text-mainColor dark:text-dark-text'>
                              Số lượng: {category.product.length || 0}
                            </Text>
                          </Stack>
                        </Link>
                      </GridCol>
                    ))}
                  </Grid>
                  <Divider />
                  <Box>
                    <Box className='flex items-center justify-between'>
                      <Title className='font-quicksand text-xl font-bold' my={'md'}>
                        Bán chạy nhất {item.title}
                      </Title>
                      <Link
                        href='/thuc-don?loai=san-pham-ban-chay'
                        className='flex items-center text-mainColor hover:underline'
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
                          <GridCol span={3} key={product.id}>
                            <Link key={product.id} href='#'>
                              <Stack gap={0}>
                                <Paper
                                  withBorder
                                  w={'100%'}
                                  h={120}
                                  radius={'lg'}
                                  pos={'relative'}
                                  className='overflow-hidden border border-transparent p-1 transition-all hover:border-red-500'
                                >
                                  <Image
                                    loading='lazy'
                                    src={
                                      getImageProduct(product?.images, LocalImageType.THUMBNAIL) ||
                                      '/images/jpg/empty-300x240.jpg'
                                    }
                                    alt={product.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                  />
                                </Paper>
                                <Stack gap={2} ml={4}>
                                  <Tooltip label={product.name}>
                                    <Text fw={700} size='sm' lineClamp={1}>
                                      {product.name}
                                    </Text>
                                  </Tooltip>
                                  <Text fw={700} size='sm' className='text-mainColor'>
                                    {formatPriceLocaleVi(product?.price || 0)}
                                  </Text>
                                </Stack>
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
