'use client';
import { Box, Burger, Button, Flex, Menu, ScrollAreaAutosize, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCategory, IconChevronCompactDown } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Empty from '~/components/Empty';
import ControlModeTheme from '../../../ControlModeTheme';
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
      px={{ base: 10, sm: 30, md: 30, lg: 130 }}
      align={'center'}
      justify={'space-between'}
      py={'md'}
      className='sticky top-0 z-[100] bg-white text-black dark:bg-dark-background dark:text-dark-text'
      direction={{ base: 'row', md: 'row' }}
    >
      <Burger opened={opened} onClick={toggle} aria-label='Toggle navigation' className='md:hidden' />
      <Flex gap={{ base: 'md', lg: 0, xl: 'md' }} direction={{ base: 'row-reverse', xl: 'row' }} align={'center'}>
        <Box className='hidden sm:order-3 sm:block md:hidden'>
          <Link href={'/goi-mon-nhanh'}>
            <Button size='sm' radius={'xl'} variant='subtle' px={'md'} className='bg-red-600 text-white'>
              <Text fw={700} size='sm'>
                Mua nhanh
              </Text>
            </Button>
          </Link>
        </Box>
        <Box className='hidden sm:order-2 sm:block md:hidden'>
          <Button variant='outline' className='border-mainColor text-mainColor' radius={'xl'} leftSection='Chế độ'>
            <ControlModeTheme />
          </Button>
        </Box>
        <Box className='sm:order-1' p={0} m={0}>
          <Menu
            shadow='md'
            classNames={{
              dropdown: 'border-mainColor bg-white',
              item: 'hover:bg-mainColor hover:text-white'
            }}
            onOpen={() => setImgMounted(true)}
            width={200}
            offset={0}
            transitionProps={{ transition: 'rotate-right', duration: 500 }}
          >
            <Menu.Target>
              <Button
                className='bg-subColor text-black duration-200 hover:bg-mainColor hover:text-white'
                radius={'sm'}
                size='sm'
                px={0}
                mx={0}
                w={{ base: 150, sm: 200 }}
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
                                loading='lazy'
                                src={item?.image?.url || '/images/jpg/empty-300x240.jpg'}
                                style={{ objectFit: 'cover' }}
                                alt='logo'
                                width={30}
                                height={30}
                              />
                            }
                          >
                            <Text size='sm' fw={700} className='dark:text-dark-text'>
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

      <NavigationHeader categories={categoriesData} />
      <NavigationHeaderMobile opened={opened} close={close} />
    </Flex>
  );
};

export default Header3;
