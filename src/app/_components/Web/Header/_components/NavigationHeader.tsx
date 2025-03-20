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
  Image,
  Menu,
  rem,
  ScrollAreaAutosize,
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
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MegaMenu } from '~/app/(web)/thuc-don/_components/MegaMenu';
import useScrollPosition from '~/app/_components/Hooks/use-on-scroll';
import CartButton from './gio-hang-button';
import PromotionButton from './khuyen-mai';

const navigationItem = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Thực đơn', href: '/thuc-don' },
  { label: 'Về PhungFood', href: '/gioi-thieu' },
  { label: 'Liên Hệ', href: '/lien-he' },
  { label: 'Tin tức', href: '/tin-tuc' },
  { label: 'Mua hàng nhanh', href: '/goi-mon-nhanh' }
];
export const HEIGHT_HEADER = 110;
export default function NavigationHeader({
  categories,
  opened,
  close,
  toggle
}: {
  categories?: any;
  opened?: boolean;
  close?: () => void;
  toggle?: () => void;
}) {
  const { data: user } = useSession();
  const [cart, setCart, resetCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  const [seletedVouchers, setSelectedVouchers, resetSelectedVouchers] = useLocalStorage<any[]>({
    key: 'vouchers',
    defaultValue: []
  });
  const pathname = usePathname();
  const notDesktop = useMediaQuery(`(max-width: 1023px)`);
  const scroll = useScrollPosition(HEIGHT_HEADER);
  const cssLink = 'duration-600 rounded-t-lg  transition ease-in-out h-[max-content] ';
  return !notDesktop ? (
    <Flex gap={'md'} align={'center'} style={{ transition: 'all 0.3s' }}>
      {navigationItem.map((item, index) =>
        item.href === '/thuc-don' ? (
          <Menu
            shadow='md'
            key={index}
            trigger={'hover'}
            withOverlay
            onOpen={() => {
              document.body.style.overflow = 'hidden';
            }}
            onClose={() => {
              document.body.style.overflow = '';
            }}
            overlayProps={{
              zIndex: 99
            }}
            disabled={(categories && categories.length > 0) || !notDesktop ? false : true}
            width={1000}
            offset={16}
            transitionProps={{ transition: 'fade-up', duration: 300 }}
          >
            <Menu.Target>
              <Link key={index} href={item.href} style={{ transition: 'all 0.3s' }} className={clsx(cssLink)}>
                <Button
                  size='sm'
                  radius={'xl'}
                  variant='subtle'
                  px={'md'}
                  className={clsx(
                    'text-[#008b4b] hover:bg-[#008b4b] hover:text-white',
                    pathname === item.href ? 'bg-[#008b4b] text-white' : 'bg-[#f1faf6] text-[#008b4b]'
                  )}
                  rightSection={item.href === '/thuc-don' && <IconCaretDown size={18} />}
                >
                  <Text fw={700} size='sm'>
                    {item.label}
                  </Text>
                </Button>
              </Link>
            </Menu.Target>
            <Menu.Dropdown>
              <MegaMenu categories={categories} />
            </Menu.Dropdown>
          </Menu>
        ) : (
          <Link key={index} href={item.href} style={{ transition: 'all 0.3s' }} className={clsx(cssLink)}>
            <Button
              size='sm'
              radius={'xl'}
              variant='subtle'
              px={'md'}
              className={clsx(
                'text-[#008b4b] hover:bg-[#008b4b] hover:text-white',
                pathname === item.href ? 'bg-[#008b4b] text-white' : 'bg-[#f1faf6] text-[#008b4b]',
                item.href === '/goi-mon-nhanh' ? 'animate-wiggle bg-red-600 text-white' : ''
              )}
              rightSection={item.href === '/thuc-don' && <IconCaretDown size={18} />}
            >
              <Text fw={700} size='sm'>
                {item.label}
              </Text>
            </Button>
          </Link>
        )
      )}
      {scroll >= HEIGHT_HEADER && (
        <Box className={clsx('animate-fadeTop')}>
          <CartButton />
        </Box>
      )}
    </Flex>
  ) : (
    <Drawer
      opened={opened || false}
      onClose={() => {
        close?.();
      }}
      size={'xs'}
      title={
        <Link href={'/'}>
          <Center>
            <Image loading='lazy' src='/logo/logo_phungfood_1.png' alt='logo' w={250} h={80} p={0} />
          </Center>
        </Link>
      }
      withCloseButton={false}
      pos={'relative'}
      scrollAreaComponent={ScrollAreaAutosize}
    >
      <ActionIcon bg={'transparent'} c='black' pos={'absolute'} top={50} right={10} onClick={close}>
        <IconX size={20} color='black' />
      </ActionIcon>
      {user?.user?.email && (
        <Box mb={20}>
          <Menu width={260} position='bottom-end' transitionProps={{ transition: 'fade-down' }} offset={0} withinPortal>
            <Menu.Target>
              <UnstyledButton
                w={'100%'}
                className={`flex items-center rounded-full bg-[#f8c144] p-1 transition-colors duration-200 hover:opacity-95`}
              >
                <Flex justify={'space-between'} align={'center'} gap={7} w={'100%'}>
                  <Group gap={7}>
                    <Avatar
                      src={
                        user?.user?.details?.image && user?.user?.details?.image !== ''
                          ? user?.user?.details?.image
                          : ''
                      }
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
            <Menu.Dropdown className='bg-[#f8c144]'>
              <Link href={`/thong-tin`} className='text-white'>
                <Menu.Item
                  fw={500}
                  leftSection={
                    <IconUser fontWeight={'bold'} style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                  }
                >
                  Thông tin cá nhân
                </Menu.Item>
              </Link>
              <Divider />

              <Link href={`/don-hang-cua-toi`} className='text-white'>
                <Menu.Item
                  fw={500}
                  leftSection={
                    <IconShoppingBag fontWeight={'bold'} style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                  }
                >
                  Đơn hàng của tôi
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
            className={clsx(cssLink)}
          >
            <Button
              size='sm'
              radius={'xl'}
              variant='subtle'
              px={'md'}
              className={clsx(
                'text-[#008b4b] hover:bg-[#008b4b] hover:text-white',
                pathname === item.href ? 'bg-[#008b4b] text-white' : 'bg-[#f1faf6] text-[#008b4b]',
                item.href === '/goi-mon-nhanh' ? 'animate-wiggle bg-red-600 text-white' : ''
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
        {scroll >= HEIGHT_HEADER && (
          <Box className={clsx('animate-fadeTop')}>
            <CartButton />
          </Box>
        )}
      </Flex>

      {!user?.user?.email && (
        <Flex pr={10} align={'center'} justify={'center'}>
          <IconUserCircle size={20} className='mr-1' />
          <Text size='sm' className={clsx(cssLink, 'cursor-pointer font-bold hover:underline', 'text-black')}>
            Đăng kí
          </Text>
          <Text pl={'xs'} pr={'xs'}>
            /
          </Text>
          <Text size='sm' className={clsx(cssLink, 'cursor-pointer font-bold hover:underline', 'text-black')}>
            Đăng nhập
          </Text>
        </Flex>
      )}
      <Box className='flex justify-center gap-4 lg:justify-start'>
        <Link href='#' className='rounded-sm text-white hover:underline hover:opacity-80'>
          <Image loading='lazy' src='/images/png/logo_playstore.png' alt='Google Play' w={140} h={42} />
        </Link>
        <Link href='#' className='rounded-sm text-white hover:underline hover:opacity-80'>
          <Image loading='lazy' src='/images/png/logo_appstore.png' alt='App Store' w={140} h={42} />
        </Link>
      </Box>
    </Drawer>
  );
}
