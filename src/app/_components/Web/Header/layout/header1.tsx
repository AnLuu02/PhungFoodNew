'use client';
import {
  ActionIcon,
  Avatar,
  Button,
  Center,
  Divider,
  Flex,
  Group,
  Image,
  Menu,
  rem,
  Text,
  UnstyledButton
} from '@mantine/core';
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
import Link from 'next/link';

export const Header1 = ({ restaurant }: any) => {
  const [cart, setCart, resetCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  const [seletedVouchers, setSelectedVouchers, resetSelectedVouchers] = useLocalStorage<any[]>({
    key: 'vouchers',
    defaultValue: []
  });
  const { data: user } = useSession();
  const [langue, setLangue] = useLocalStorage<any>({ key: 'langue', defaultValue: 'vn' });
  return (
    <Flex
      direction={{ base: 'column', sm: 'row', md: 'row' }}
      h={{ base: 'max-content', md: 40 }}
      bg={'green.9'}
      pos={'relative'}
      pl={{ base: rem(20), lg: rem(130) }}
      pr={{ base: rem(20), sm: rem(60), md: rem(60), lg: rem(130) }}
      align={'center'}
      justify={{ base: 'flex-start', sm: 'space-between', md: 'space-between' }}
      className='z-[100] text-white'
    >
      <Center w={{ sm: '30%', lg: 'max-content' }}>
        <Text size='sm' lineClamp={2}>
          Chào mừng bạn đến với Phụng Food!
        </Text>
      </Center>

      <Group align={'center'} justify='center' gap={0}>
        {/* <Group align={'center'} gap={'sm'}>
          <Image
            src={'/images/png/co vn.png'}
            w={langue === 'vn' ? 35 : 20}
            onClick={() => setLangue('vn')}
            className={clsx(langue === 'vn' ? '' : 'cursor-pointer')}
          />
          <Text>|</Text>
          <Image
            src={'/images/png/co anh.png'}
            w={langue === 'us' ? 35 : 20}
            onClick={() => setLangue('us')}
            className={clsx(langue === 'us' ? '' : 'cursor-pointer')}
          />
        </Group> */}
        <Group gap='md'>
          {restaurant?.openedHours && restaurant?.closedHours ? (
            <Button
              size='xs'
              radius='xl'
              variant='subtle'
              c={'white'}
              leftSection={<IconClock size={16} />}
              color={!restaurant?.isClose ? 'blue' : 'red'}
            >
              {!restaurant?.isClose
                ? `MỞ CỬA: ${restaurant?.openedHours} ĐẾN ${restaurant?.closedHours}`
                : `ĐÃ ĐÓNG CỬA: MỞ LẠI LÚC ${restaurant?.closedHours}`}
            </Button>
          ) : (
            ''
          )}
          <Menu position='bottom-end' shadow='md'>
            <Menu.Target>
              <ActionIcon variant='subtle' color='gray.0' radius='xl'>
                <IconWorld size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                onClick={() => setLangue('vn')}
                leftSection={
                  <Image
                    src={'/images/png/co vn.png'}
                    w={langue === 'vn' ? 35 : 20}
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
                    src={'/images/png/co anh.png'}
                    w={langue === 'us' ? 35 : 20}
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
                  className={`flex items-center rounded-full bg-[#f8c144] p-1 transition-colors duration-200 hover:opacity-95`}
                >
                  <Group gap={7}>
                    <Avatar src={user?.user?.image} alt='User avatar' radius='lg' size={30} />
                    <div className='hidden text-left sm:block'>
                      <Text fw={700} size='sm' lh={1} className='text-black'>
                        {user?.user?.name}
                      </Text>
                      <Text size='xs' fw={700} className='text-gray-500'>
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
          ) : (
            <Group gap={'xs'} align={'center'}>
              <IconUserCircle size={20} fontWeight={'bold'} />
              <Link href='/auth/dang-ki' className='text-white'>
                <Text size='sm' className={clsx('cursor-pointer font-bold hover:underline')}>
                  Đăng kí
                </Text>
              </Link>
              <Text>/</Text>
              <Link href='/auth/dang-nhap' className='text-white'>
                <Text size='sm' className={clsx('cursor-pointer font-bold hover:underline')}>
                  Đăng nhập
                </Text>
              </Link>
            </Group>
          )}
        </Group>
        {/* <Switch
              size='md'
              color='dark.4'
              onChange={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
              onLabel={<IconSun style={{ width: rem(20), height: rem(20) }} stroke={1.5} />}
              offLabel={<IconMoon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />}
            /> */}
      </Group>
    </Flex>
  );
};
