'use client';

import { Avatar, Box, Divider, Flex, Group, Menu, Text, UnstyledButton } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconChevronDown, IconLock, IconLogout, IconShoppingBag, IconUser, IconUserCircle } from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { CartItem, VoucherForUser } from '~/types/client-type-trpc';

const menuUser = [
  { label: 'Thông tin cá nhân', href: '/thong-tin', icon: IconUser },
  { label: 'Đơn hàng của tôi', href: '/don-hang-cua-toi', icon: IconShoppingBag },
  { label: 'Đổi mật khẩu', href: '/password/change-password', icon: IconLock }
];

export default function UserSection({
  responsive,
  width
}: {
  responsive?: boolean;
  width?: string | number | undefined;
}) {
  const [, , resetCart] = useLocalStorage<CartItem[]>({ key: 'cart', defaultValue: [] });
  const [, , resetSelectedVouchers] = useLocalStorage<VoucherForUser>({
    key: 'applied-vouchers',
    defaultValue: []
  });
  const { data: user } = useSession();
  if (!user)
    return (
      <Group gap={'xs'} align={'center'} justify='center'>
        <IconUserCircle size={20} fontWeight={'bold'} />
        <Link href='/dang-ky' className={`${responsive ? 'text-white' : 'text-black dark:text-dark-text'}`}>
          <Text size='sm' className={`cursor-pointer font-bold hover:underline`}>
            Đăng kí
          </Text>
        </Link>
        <Text>/</Text>
        <Link href='/dang-nhap' className={`${responsive ? 'text-white' : 'text-black dark:text-dark-text'}`}>
          <Text size='sm' className={`cursor-pointer font-bold hover:underline`}>
            Đăng nhập
          </Text>
        </Link>
      </Group>
    );
  return (
    <Menu
      radius={'md'}
      width={200}
      position='bottom-end'
      transitionProps={{ transition: 'fade-down' }}
      offset={0}
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton
          className={`flex items-center rounded-full bg-subColor p-1 transition-colors duration-200 hover:opacity-95`}
          w={width}
        >
          <Flex justify={'space-between'} align={'center'} gap={7} w={'100%'}>
            <Group gap={7}>
              <Box pos={'relative'} w={30} h={30} className='overflow-hidden rounded-full'>
                <Avatar
                  radius={'xl'}
                  size={30}
                  src={user?.user?.image}
                  alt='User avatar'
                  style={{ objectFit: 'cover' }}
                />
              </Box>
              <Box className={`text-left ${responsive && 'hidden sm:block'}`}>
                <Text fw={700} size='sm' lh={1} className='text-black'>
                  {user?.user?.name}
                </Text>
                <Text size='xs' fw={700} c={'dimmed'}>
                  {user?.user?.email}
                </Text>
              </Box>
            </Group>
            <IconChevronDown
              style={{ width: 12, height: 12 }}
              stroke={1.5}
              className={`mr-4 text-gray-500 dark:text-dark-text ${responsive && 'mr-0 hidden sm:block'}`}
            />
          </Flex>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown className='bg-subColor'>
        <Divider />

        {menuUser.map((item, index) => (
          <>
            <Link key={index} href={item.href}>
              <Menu.Item
                fw={500}
                key={index}
                className='hover:bg-[rgba(0,0,0,0.2)]'
                leftSection={
                  <item.icon color='black' fontWeight={'bold'} style={{ width: 16, height: 16 }} stroke={1.5} />
                }
              >
                <Text size='sm' className='text-black' p={0}>
                  {item.label}
                </Text>
              </Menu.Item>
            </Link>
            <Divider />
          </>
        ))}

        <Menu.Item
          fw={500}
          leftSection={<IconLogout fontWeight={'bold'} style={{ width: 16, height: 16 }} stroke={1.5} />}
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
  );
}
