'use client';
import { ActionIcon, Box, Button, Flex, Menu, ScrollAreaAutosize, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCategory, IconChevronCompactDown, IconMenu3 } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Empty from '~/components/Empty';
import DynamicCartButton from '../components/DynamicCartButton';
import NavigationHeader from '../components/NavigationHeader';
import NavigationHeaderMobile from '../components/NavigationHeaderMobile';

const Header3 = ({ categories, subCategories }: any) => {
  const [imgMounted, setImgMounted] = useState(false);
  const subCategoriesData: any = subCategories || [];
  const categoriesData: any = categories || [];
  const [opened, { close, toggle }] = useDisclosure();
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
      <ActionIcon
        variant='default'
        size='xl'
        radius={'md'}
        onClick={toggle}
        className='border border-gray-100 bg-gray-50 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)] transition-all hover:shadow-[2px_2px_5px_rgba(0,0,0,0.1)] active:translate-y-0.5 active:shadow-inner dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-[4px_4px_12px_rgba(0,0,0,0.5),-1px_-1px_10px_rgba(255,255,255,0.02)] dark:hover:shadow-[2px_2px_8px_rgba(0,0,0,0.6)] dark:active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.7)] md:hidden'
        classNames={{
          icon: 'text-mainColor'
        }}
      >
        <IconMenu3 size={32} />
      </ActionIcon>
      <Flex
        gap={{ base: 'md', lg: 0, xl: 'md' }}
        className='order-3 md:order-1'
        direction={{ base: 'row-reverse', xl: 'row' }}
        align={'center'}
      >
        <Box className='sm:order-1' p={0} m={0}>
          <Menu
            radius={'md'}
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
                  {subCategoriesData?.length > 0 ? (
                    subCategoriesData?.map((item: any, index: number) => {
                      return (
                        <Link href={`/thuc-don?danh-muc=${item?.category?.tag}&loai-san-pham=${item?.tag}`} key={index}>
                          <Menu.Item
                            key={index}
                            leftSection={
                              <Image
                                key={index}
                                loading='lazy'
                                src={item?.imageForEntity?.image?.url || '/images/jpg/empty-300x240.jpg'}
                                style={{ objectFit: 'cover' }}
                                alt={item?.imageForEntity?.altText || 'Ảnh minh họa'}
                                width={30}
                                height={30}
                              />
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
        <NavigationHeader categories={categoriesData} />
      </Box>
      <NavigationHeaderMobile opened={opened} close={close} categories={categoriesData} />
    </Flex>
  );
};

export default Header3;
