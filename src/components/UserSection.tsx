'use client';

import { Avatar, Box, Divider, Flex, Group, Menu, Text, UnstyledButton } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconChevronDown, IconLogout, IconShoppingBag, IconUser, IconUserCircle } from '@tabler/icons-react';
import clsx from 'clsx';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function UserSection({ responsive, width }: { responsive?: boolean; width?: any }) {
  const [, , resetCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  const [, , resetSelectedVouchers] = useLocalStorage<any[]>({
    key: 'applied-vouchers',
    defaultValue: []
  });
  const { data: user } = useSession();
  if (!user)
    return (
      <Group gap={'xs'} align={'center'} justify='center'>
        <IconUserCircle size={20} fontWeight={'bold'} />
        <Link href='/dang-ki' className={clsx(responsive ? 'text-white' : 'text-black dark:text-dark-text')}>
          <Text size='sm' className={clsx('cursor-pointer font-bold hover:underline')}>
            Đăng kí
          </Text>
        </Link>
        <Text>/</Text>
        <Link href='/dang-nhap' className={clsx(responsive ? 'text-white' : 'text-black dark:text-dark-text')}>
          <Text size='sm' className={clsx('cursor-pointer font-bold hover:underline')}>
            Đăng nhập
          </Text>
        </Link>
      </Group>
    );
  return (
    <Menu width={200} position='bottom-end' transitionProps={{ transition: 'fade-down' }} offset={0} withinPortal>
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
              <Box className={clsx('text-left', responsive && 'hidden sm:block')}>
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
              className={clsx('mr-4 text-gray-500', responsive && 'mr-0 hidden sm:block')}
            />
          </Flex>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown className='bg-subColor'>
        <Divider />
        <Link href={`/thong-tin`}>
          <Menu.Item
            fw={500}
            className='hover:bg-[rgba(0,0,0,0.2)]'
            leftSection={<IconUser color='black' fontWeight={'bold'} style={{ width: 16, height: 16 }} stroke={1.5} />}
          >
            <Text size='sm' className='text-black' p={0}>
              Thông tin cá nhân
            </Text>
          </Menu.Item>
        </Link>
        <Divider />

        <Link href={`/don-hang-cua-toi`}>
          <Menu.Item
            className='hover:bg-[rgba(0,0,0,0.2)]'
            fw={500}
            leftSection={
              <IconShoppingBag color='black' fontWeight={'bold'} style={{ width: 16, height: 16 }} stroke={1.5} />
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
