'use client';
import { Box, Button, Flex, Menu, Paper, ScrollAreaAutosize, Text } from '@mantine/core';
import { IconCategory, IconChevronCompactDown } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Empty from '~/components/Empty';
import { SubCategoryBasic } from '~/shared/type-trpc/subCategory.type-trpc';
import { api } from '~/trpc/react';
import DynamicCartButton from '../components/client-component/DynamicCartButton';
import NavigationHeader from '../components/client-component/NavigationHeader';
import NavigationHeaderMobile from '../components/client-component/NavigationHeaderMobile';

const Header3 = () => {
  const [imgMounted, setImgMounted] = useState(false);
  const { data, isLoading } = api.SubCategory.getSubCategoriesWithRelationBasic.useQuery();
  const subCategories = data ?? [];

  return (
    <Flex
      px={{ base: 10, sm: 30, lg: 130 }}
      align={'center'}
      justify={'space-between'}
      py={'md'}
      gap={{ base: 0, sm: 'md', lg: 0 }}
      className='sticky top-0 z-[100] bg-white text-black dark:bg-dark-background dark:text-dark-text'
      direction={{ base: 'row', md: 'row' }}
    >
      <NavigationHeaderMobile />
      <Flex
        gap={{ base: 'md', lg: 0, xl: 'md' }}
        className='order-3 md:order-1'
        direction={{ base: 'row-reverse', xl: 'row' }}
        align={'center'}
      >
        <Box className='sm:order-1' p={0} m={0}>
          <Menu
            shadow='md'
            classNames={{
              dropdown: 'border-mainColor bg-white',
              item: 'hover:bg-mainColor hover:text-white'
            }}
            onOpen={() => setImgMounted(true)}
            width={180}
            offset={0}
            transitionProps={{ transition: 'rotate-right', duration: 500 }}
          >
            <Menu.Target>
              <Button
                className='bg-subColor text-black duration-200 hover:bg-mainColor hover:text-white'
                radius={'xl'}
                size='sm'
                px={0}
                mx={0}
                w={{ base: 150, sm: 180 }}
                leftSection={<IconCategory size={20} />}
                rightSection={<IconChevronCompactDown size={20} />}
              >
                Danh mục
              </Button>
            </Menu.Target>

            <Menu.Dropdown className='bg-white p-0 shadow-md dark:bg-dark-card'>
              {imgMounted ? (
                <ScrollAreaAutosize mah={{ base: 300, md: 400 }} scrollbarSize={5}>
                  {subCategories?.length > 0 ? (
                    subCategories?.map((item: SubCategoryBasic, index: number) => {
                      return (
                        <Link href={`/thuc-don?danh-muc=${item?.category?.tag}&loai-san-pham=${item?.tag}`} key={index}>
                          <Menu.Item
                            key={index}
                            leftSection={
                              <Paper w={30} h={30} pos={'relative'} className='overflow-hidden'>
                                <Image
                                  key={index}
                                  loading='lazy'
                                  src={item?.imageForEntity?.image?.url || '/images/jpg/empty-300x240.jpg'}
                                  style={{ objectFit: 'cover' }}
                                  alt={item?.imageForEntity?.altText || 'Ảnh minh họa'}
                                  fill
                                />
                              </Paper>
                            }
                          >
                            <Text size='sm' fw={700} className='dark:text-dark-text' key={index}>
                              {item?.name}
                            </Text>
                          </Menu.Item>
                        </Link>
                      );
                    })
                  ) : (
                    <Empty size='xs' hasButton={false} title='Danh mục trống' content='' />
                  )}
                </ScrollAreaAutosize>
              ) : (
                <Box></Box>
              )}
            </Menu.Dropdown>
          </Menu>
        </Box>
        <Box className='sm:order-4 md:fixed md:right-[-40px] md:top-[45%] lg:static'>
          <DynamicCartButton />
        </Box>
      </Flex>

      <Box className='order-2 hidden sm:block md:order-3'>
        <NavigationHeader />
      </Box>
    </Flex>
  );
};

export default Header3;
