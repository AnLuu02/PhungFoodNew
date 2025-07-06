'use client';

import { ActionIcon, Box, Button, Center, Divider, Flex, Group, Menu, rem, Text, UnstyledButton } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import {
  IconChevronDown,
  IconClock,
  IconLogout,
  IconShoppingBag,
  IconUser,
  IconUserCircle,
  IconWorld
} from '@tabler/icons-react';
import clsx from 'clsx';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import ControlModeTheme from '../../ControlModeTheme';

export const Header1 = ({ restaurant }: any) => {
  const restaurantData = restaurant ?? {};
  const [, , resetCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  const [, , resetSelectedVouchers] = useLocalStorage<any[]>({
    key: 'vouchers',
    defaultValue: []
  });

  const { data: user } = useSession();
  const [langue, setLangue] = useLocalStorage<any>({ key: 'langue', defaultValue: 'vn' });
  return (
    <Flex
      direction={{ base: 'column', sm: 'row', md: 'row' }}
      h={{ base: 'max-content', md: 40 }}
      pos={'relative'}
      pl={{ base: rem(20), lg: rem(130) }}
      pr={{ base: rem(20), sm: rem(60), lg: rem(130) }}
      align={'center'}
      justify={{ base: 'flex-start', sm: 'space-between', md: 'space-between' }}
      className='z-[100] bg-mainColor text-white'
    >
      <Center py={{ base: 'md' }}>
        <Text size='sm' lineClamp={2}>
          <b>Phụng Food!</b> xin chào quý khách!
        </Text>
      </Center>

      <Group align={'center'} justify='center' gap={0}>
        <Group gap='md' align={'center'} justify='center'>
          {restaurantData?.openedHours && restaurantData?.closedHours ? (
            <Button
              size='xs'
              radius='xl'
              variant='subtle'
              className='text-white'
              leftSection={<IconClock size={16} />}
              color={!restaurantData?.isClose ? 'blue' : 'red'}
            >
              {!restaurantData?.isClose
                ? `MỞ CỬA: ${restaurantData?.openedHours} ĐẾN ${restaurantData?.closedHours}`
                : `ĐÃ ĐÓNG CỬA: MỞ LẠI LÚC ${restaurantData?.closedHours}`}
            </Button>
          ) : (
            ''
          )}

          <Menu position='bottom-end' shadow='md'>
            <Menu.Target>
              <ActionIcon variant='subtle' color='gray.0' radius='xl' className='hidden lg:block'>
                <IconWorld size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown className='hidden lg:block'>
              <Menu.Item
                onClick={() => setLangue('vn')}
                leftSection={
                  <Image
                    loading='lazy'
                    src={'/images/png/co vn.png'}
                    width={langue === 'vn' ? 35 : 20}
                    height={langue === 'vn' ? 35 : 20}
                    alt='vietnam-flag'
                    style={{ objectFit: 'cover' }}
                    className={clsx(langue === 'vn' ? '' : 'cursor-pointer')}
                  />
                }
              >
                Tiếng Việt
              </Menu.Item>
              <Menu.Item
                onClick={() => setLangue('us')}
                leftSection={
                  <Image
                    loading='lazy'
                    src={'/images/png/co anh.png'}
                    width={langue === 'us' ? 35 : 20}
                    height={langue === 'us' ? 35 : 20}
                    alt='english-flag'
                    style={{ objectFit: 'cover' }}
                    className={clsx(langue === 'us' ? '' : 'cursor-pointer')}
                  />
                }
              >
                English
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          {user?.user?.email ? (
            <Menu
              width={200}
              position='bottom-end'
              transitionProps={{ transition: 'fade-down' }}
              offset={0}
              withinPortal
            >
              <Menu.Target>
                <UnstyledButton
                  className={`flex items-center rounded-full bg-subColor p-1 transition-colors duration-200 hover:opacity-95`}
                >
                  <Group gap={7}>
                    <Box pos={'relative'} w={30} h={30} className='overflow-hidden rounded-full'>
                      <Image src={user?.user?.image || ''} alt='User avatar' fill style={{ objectFit: 'cover' }} />
                    </Box>
                    <div className='hidden text-left sm:block'>
                      <Text fw={700} size='sm' lh={1} className='text-black'>
                        {user?.user?.name}
                      </Text>
                      <Text size='xs' fw={700} c={'dimmed'}>
                        {user?.user?.email}
                      </Text>
                    </div>
                    <IconChevronDown
                      style={{ width: rem(12), height: rem(12) }}
                      stroke={1.5}
                      className='hidden text-gray-500 sm:block'
                    />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown className='bg-subColor'>
                <Divider />
                <Link href={`/thong-tin`}>
                  <Menu.Item
                    fw={500}
                    leftSection={
                      <IconUser
                        color='black'
                        fontWeight={'bold'}
                        style={{ width: rem(16), height: rem(16) }}
                        stroke={1.5}
                      />
                    }
                  >
                    <Text size='sm' className='text-black' p={0}>
                      Thông tin cá nhân
                    </Text>
                  </Menu.Item>
                </Link>
                <Divider />

                <Link href={`/don-hang-cua-toi`}>
                  <Menu.Item
                    fw={500}
                    leftSection={
                      <IconShoppingBag
                        color='black'
                        fontWeight={'bold'}
                        style={{ width: rem(16), height: rem(16) }}
                        stroke={1.5}
                      />
                    }
                  >
                    <Text size='sm' className='text-black' p={0}>
                      Đơn hàng của tôi
                    </Text>
                  </Menu.Item>
                </Link>
                <Divider />

                <Menu.Item
                  fw={500}
                  leftSection={
                    <IconLogout fontWeight={'bold'} style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                  }
                  color='white'
                  mt={'xs'}
                  className='bg-red-500 hover:bg-red-600'
                  onClick={() => {
                    resetCart();
                    resetSelectedVouchers();
                    signOut({ callbackUrl: 'https://www.facebook.com/' });
                  }}
                >
                  Đăng xuất
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Group gap={'xs'} align={'center'}>
              <IconUserCircle size={20} fontWeight={'bold'} />
              <Link href='/dang-ki' className='text-white'>
                <Text size='sm' className={clsx('cursor-pointer font-bold hover:underline')}>
                  Đăng kí
                </Text>
              </Link>
              <Text>/</Text>
              <Link href='/dang-nhap' className='text-white'>
                <Text size='sm' className={clsx('cursor-pointer font-bold hover:underline')}>
                  Đăng nhập
                </Text>
              </Link>
            </Group>
          )}

          <Box
            pos={{ base: 'fixed', sm: 'unset', md: 'unset', lg: 'fixed' }}
            left={{ base: 5, sm: 0, md: 0, lg: 5 }}
            top={{ base: 8, sm: 15, md: 0, lg: 8 }}
            className='md:hidden lg:block'
          >
            <ControlModeTheme />
          </Box>
        </Group>
      </Group>
    </Flex>
  );
};
