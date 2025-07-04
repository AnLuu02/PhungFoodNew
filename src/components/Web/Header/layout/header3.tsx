'use client';
import { Box, Burger, Button, Flex, Group, Menu, rem, ScrollAreaAutosize, Text } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconCategory, IconChevronCompactDown } from '@tabler/icons-react';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Empty from '~/components/Empty';
import { breakpoints } from '~/constants';
import NavigationHeader from '../components/NavigationHeader';

const Header3 = ({ categories, subCategories }: any) => {
  const [imgMounted, setImgMounted] = useState(false);
  const subCategoriesData: any = subCategories || [];
  const categoriesData: any = categories || [];

  const isMobile = useMediaQuery(`(max-width: ${breakpoints.sm}px)`);
  const notDesktop = useMediaQuery(`(min-width: ${breakpoints.sm}px) and ( max-width: 1023px) `);
  const [opened, { open, close, toggle }] = useDisclosure();

  return (
    <Flex
      pl={{ base: rem(20), lg: rem(130) }}
      pr={{ base: rem(20), lg: rem(130) }}
      align={'center'}
      justify={'space-between'}
      py={'md'}
      className='sticky top-0 z-[100] bg-white'
      direction={{ base: 'row', md: 'row' }}
    >
      {(isMobile || notDesktop) && <Burger opened={opened} onClick={toggle} aria-label='Toggle navigation' />}
      <Group>
        {notDesktop && (
          <Link href={'/goi-mon-nhanh'}>
            <Button
              size='sm'
              radius={'xl'}
              variant='subtle'
              px={'md'}
              className={clsx('animate-wiggle bg-red-600 text-white hover:bg-[#008b4b] hover:text-white')}
            >
              <Text fw={700} size='sm'>
                Mua hàng nhanh
              </Text>
            </Button>
          </Link>
        )}
        <Menu
          shadow='md'
          classNames={{
            dropdown: 'border-[#008b4b] bg-white',
            item: 'hover:bg-[#008b4b] hover:text-white'
          }}
          onOpen={() => setImgMounted(true)}
          width={200}
          offset={0}
          transitionProps={{ transition: 'rotate-right', duration: 500 }}
        >
          <Menu.Target>
            <Button
              className='hover:opacity-90'
              radius={'sm'}
              size='sm'
              px={0}
              w={200}
              c={'black'}
              leftSection={<IconCategory size={20} />}
              rightSection={<IconChevronCompactDown size={20} />}
              bg={'yellow.8'}
            >
              Danh mục
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            {imgMounted ? (
              <ScrollAreaAutosize mah={rem(400)} scrollbarSize={5}>
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
                          <Text size='sm' fw={700}>
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
      </Group>

      <NavigationHeader categories={categoriesData} opened={opened} close={close} />
    </Flex>
  );
};

export default Header3;
