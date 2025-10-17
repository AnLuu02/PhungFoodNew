'use client';

import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Menu,
  Paper,
  Stack,
  Text,
  Title,
  UnstyledButton
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconChevronDown, IconLock, IconMail, IconShoppingBag, IconUser, IconUserCircle } from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

const menuUser = [
  { label: 'Thông tin cá nhân', des: 'Xem và cập nhật thông tin cá nhân', href: '/thong-tin', icon: IconUser },
  {
    label: 'Đơn hàng của tôi',
    des: 'Xem và quản lý các đơn hàng',
    href: '/don-hang-cua-toi',
    icon: IconShoppingBag
  },
  { label: 'Đổi mật khẩu', des: 'Đổi mật khẩu người dùng', href: '/auth/password/change-password', icon: IconLock }
];

export default function UserSectionDesktop({ responsive, width }: { responsive?: boolean; width?: any }) {
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
        <Link href='/auth/register' className={`${responsive ? 'text-white' : 'text-black dark:text-dark-text'}`}>
          <Text size='sm' className={`cursor-pointer font-bold hover:underline`}>
            Đăng kí
          </Text>
        </Link>
        <Text>/</Text>
        <Link href='/auth/login' className={`${responsive ? 'text-white' : 'text-black dark:text-dark-text'}`}>
          <Text size='sm' className={`cursor-pointer font-bold hover:underline`}>
            Đăng nhập
          </Text>
        </Link>
      </Group>
    );
  return (
    <Menu width={360} position='bottom-end' transitionProps={{ transition: 'fade-down' }} offset={0} withinPortal>
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
      <Menu.Dropdown p={0} className='rounded-md'>
        <Box py={'lg'} pt={'xl'} className='rounded-md shadow-md'>
          <Stack px={'lg'}>
            <Title order={3} className='font-quicksand'>
              Thông tin
            </Title>
            <Flex align={'flex-start'} gap={'md'}>
              <Box
                w={80}
                h={80}
                className='overflow-hidden rounded-full border border-solid border-mainColor'
                pos={'relative'}
              >
                <Image
                  src={user?.user?.image || '/images/png/403.png'}
                  alt='User avatar'
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </Box>
              <Stack gap={2}>
                <Text fw={700}> {user?.user?.name}</Text>
                <Text size='sm' fw={600} className='text-gray-600 dark:text-dark-text'>
                  {user?.user?.role === 'CUSTOMER'
                    ? 'Người dùng'
                    : user?.user?.role === 'ADMIN'
                      ? 'Quản trị viên'
                      : 'Nhân viên'}
                </Text>
                <Group align='center' gap={5}>
                  <IconMail className='m-0 h-4 w-4 p-0 text-gray-600 dark:text-dark-text' />
                  <Text size='sm' className='text-gray-600 dark:text-dark-text'>
                    {user?.user?.email}
                  </Text>
                </Group>
              </Stack>
            </Flex>
          </Stack>
          <Box px={'lg'} mt={'md'}>
            <Divider />
          </Box>
          {menuUser?.map((item, index) => (
            <Link href={item.href} key={index}>
              <Box key={index} className='flex items-center gap-4 hover:bg-mainColor/10' px={'lg'} py={'sm'}>
                <Paper className='flex items-center justify-center bg-mainColor/10' w={50} h={50} radius={'md'}>
                  <item.icon size={20} />
                </Paper>
                <Stack gap={2}>
                  <Text fw={700}>{item.label}</Text>
                  <Text size='sm' c={'dimmed'} fw={600}>
                    {item.des}
                  </Text>
                </Stack>
              </Box>
            </Link>
          ))}

          <Box px={'lg'} mt={'md'}>
            <Button
              fullWidth
              variant='outline'
              radius={'md'}
              className='borđẻ-solid border-mainColor text-mainColor hover:bg-mainColor hover:text-white'
              onClick={() => {
                resetCart();
                resetSelectedVouchers();
                signOut({ callbackUrl: 'https://www.facebook.com/' });
              }}
            >
              Đăng xuất
            </Button>
          </Box>
        </Box>
      </Menu.Dropdown>
    </Menu>
  );
}
