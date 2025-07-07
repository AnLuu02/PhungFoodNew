'use client';
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Drawer,
  Flex,
  Group,
  Menu,
  rem,
  Text,
  UnstyledButton
} from '@mantine/core';
import { useLocalStorage, useMediaQuery } from '@mantine/hooks';
import {
  IconCaretDown,
  IconChevronDown,
  IconLogout,
  IconShoppingBag,
  IconUser,
  IconUserCircle,
  IconX
} from '@tabler/icons-react';
import clsx from 'clsx';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo } from 'react';
import CartButton from './gio-hang-button';
import PromotionButton from './khuyen-mai';

const navigationItem = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Thực đơn', href: '/thuc-don' },
  { label: 'Về PhungFood', href: '/gioi-thieu' },
  { label: 'Liên Hệ', href: '/lien-he' },
  { label: 'Tin tức', href: '/tin-tuc' },
  { label: 'Mua nhanh', href: '/goi-mon-nhanh' }
];
function NavigationHeaderMobile({ opened, close }: { opened?: boolean; close?: () => void }) {
  const { data: user } = useSession();
  const [cart, , resetCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  const [, , resetSelectedVouchers] = useLocalStorage<any[]>({
    key: 'vouchers',
    defaultValue: []
  });
  const pathname = usePathname();
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  if (isDesktop) {
    return;
  }
  return (
    <Drawer.Root
      opened={opened || false}
      onClose={() => {
        close?.();
      }}
      size={'xs'}
      pos={'relative'}
    >
      <Drawer.Overlay />
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>
            <Link href={'/'}>
              <Center w={'100%'} flex={1}>
                <Image
                  loading='lazy'
                  src='/logo/logo_phungfood_1.png'
                  alt='logo'
                  width={250}
                  height={80}
                  style={{ objectFit: 'cover' }}
                />
              </Center>
            </Link>
          </Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>
        <Drawer.Body>
          <ActionIcon bg={'red'} c='black' pos={'absolute'} top={10} right={10} onClick={close} className='z-[99]'>
            <IconX size={20} color='black' />
          </ActionIcon>
          {user?.user?.email ? (
            <Box mb={20}>
              <Menu
                width={200}
                position='bottom-end'
                transitionProps={{ transition: 'fade-down' }}
                offset={0}
                withinPortal
              >
                <Menu.Target>
                  <UnstyledButton
                    w={'100%'}
                    className={`flex items-center rounded-full bg-subColor p-1 transition-colors duration-200 hover:opacity-95`}
                  >
                    <Flex justify={'space-between'} align={'center'} gap={7} w={'100%'}>
                      <Group gap={7}>
                        <Avatar
                          src={user?.user?.image && user?.user?.image !== '' ? user?.user?.image : ''}
                          alt='User avatar'
                          radius='lg'
                          size={30}
                        />
                        <Box className='text-left'>
                          <Text fw={700} size='sm' lh={1} className='text-black'>
                            {user?.user?.name}
                          </Text>
                          <Text size='xs' fw={700} className='text-gray-500'>
                            {user?.user?.email}
                          </Text>
                        </Box>
                      </Group>
                      <IconChevronDown
                        style={{ width: rem(12), height: rem(12) }}
                        stroke={1.5}
                        className='mr-4 text-gray-500'
                      />
                    </Flex>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown className='bg-subColor'>
                  <Link href={`/thong-tin`} className='text-white'>
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
                      <Text size='sm' className='text-black'>
                        Thông tin cá nhân
                      </Text>
                    </Menu.Item>
                  </Link>
                  <Divider />

                  <Link href={`/don-hang-cua-toi`} className='text-white dark:text-dark-text'>
                    <Menu.Item
                      fw={500}
                      leftSection={
                        <IconShoppingBag
                          fontWeight={'bold'}
                          style={{ width: rem(16), height: rem(16) }}
                          stroke={1.5}
                          color='black'
                        />
                      }
                    >
                      <Text size='sm' className='text-black'>
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
            </Box>
          ) : (
            <Flex pr={10} align={'center'} justify={'center'} mb={'md'}>
              <IconUserCircle size={20} className='mr-1' />
              <Text
                size='sm'
                className={clsx(
                  'duration-600 h-[max-content] rounded-t-lg transition ease-in-out',
                  'cursor-pointer font-bold hover:underline',
                  'text-black dark:text-dark-text'
                )}
              >
                Đăng kí
              </Text>
              <Text pl={'xs'} pr={'xs'}>
                /
              </Text>
              <Text
                size='sm'
                className={clsx(
                  'duration-600 h-[max-content] rounded-t-lg transition ease-in-out',
                  'cursor-pointer font-bold hover:underline',
                  'text-black dark:text-dark-text'
                )}
              >
                Đăng nhập
              </Text>
            </Flex>
          )}

          <Flex gap={'md'} align={'center'} direction={{ base: 'column', md: 'row' }} mb={20}>
            {navigationItem.map((item, index) => (
              <Link
                key={index}
                onClick={() => {
                  close?.();
                }}
                href={item.href}
                style={{ transition: 'all 0.3s' }}
                className='duration-600 h-[max-content] rounded-t-lg transition ease-in-out'
              >
                <Button
                  size='sm'
                  radius={'xl'}
                  variant='subtle'
                  px={'md'}
                  className={clsx(
                    'transition hover:bg-mainColor hover:text-white',
                    pathname === item.href
                      ? 'bg-mainColor text-white'
                      : 'bg-[#f1faf6] text-mainColor dark:bg-dark-card dark:hover:bg-mainColor'
                  )}
                  rightSection={item.href === '/thuc-don' && <IconCaretDown size={18} />}
                >
                  <Text fw={700} size='sm'>
                    {item.label}
                  </Text>
                </Button>
              </Link>
            ))}
            <PromotionButton />
            <CartButton />
          </Flex>

          <Box className='flex justify-center gap-4 lg:justify-start'>
            <Link href='#' className='rounded-sm text-white hover:underline hover:opacity-80'>
              <Image
                loading='lazy'
                src='/images/png/logo_playstore.png'
                alt='Google Play'
                width={140}
                height={42}
                style={{ objectFit: 'cover' }}
              />
            </Link>
            <Link href='#' className='rounded-sm text-white hover:underline hover:opacity-80'>
              <Image
                loading='lazy'
                src='/images/png/logo_appstore.png'
                alt='App Store'
                width={140}
                height={42}
                style={{ objectFit: 'cover' }}
              />
            </Link>
          </Box>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
}

export default memo(NavigationHeaderMobile);
