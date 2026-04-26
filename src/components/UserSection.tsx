'use client';

import { Box, Divider, Flex, Group, Menu, Paper, Skeleton, Stack, Text, Title, UnstyledButton } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconChevronDown, IconMail, IconUserCircle } from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { menuUserInfo } from '~/lib/ConfigUI';
import BButton from './Button/Button';

export default function UserSection({ responsive, width }: { responsive?: boolean; width?: any }) {
  const [, , resetCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  const [, , resetSelectedVouchers] = useLocalStorage<any[]>({
    key: 'applied-vouchers',
    defaultValue: []
  });
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return (
      <>
        <Group gap={'xs'} align={'center'} justify='flex-end' className='sm:min-w-[222px]'>
          <Skeleton circle w={20} h={20} />
          <Skeleton width={52} height={20} radius={'xl'} className='hidden sm:block' />
          <Text className='hidden sm:block'>/</Text>
          <Skeleton width={74} height={20} radius={'xl'} />
        </Group>
      </>
    );
  }
  if (status === 'unauthenticated' || !session)
    return (
      <Group
        gap={'xs'}
        align={'center'}
        className={`justify-center sm:min-w-[222px] ${responsive ? 'sm:justify-end' : ''}`}
      >
        <IconUserCircle size={20} fontWeight={'bold'} />
        <Link
          href='/dang-ky'
          className={` ${responsive ? 'hidden text-white sm:block' : 'text-black dark:text-dark-text'}`}
        >
          <Text size='sm' className={`cursor-pointer font-bold hover:underline`}>
            Đăng kí
          </Text>
        </Link>
        <Text className={` ${responsive ? 'hidden text-white sm:block' : 'text-black dark:text-dark-text'}`}>/</Text>
        <Link href='/dang-nhap' className={`${responsive ? 'text-white' : 'text-black dark:text-dark-text'}`}>
          <Text size='sm' className={`cursor-pointer font-bold hover:underline`}>
            Đăng nhập
          </Text>
        </Link>
      </Group>
    );
  return (
    <Menu
      width={320}
      position='bottom-end'
      transitionProps={{ transition: 'pop-top-right' }}
      offset={0}
      withinPortal
      zIndex={10002}
      radius={'lg'}
      classNames={{
        dropdown: 'rounded-lg'
      }}
    >
      <Menu.Target>
        <UnstyledButton
          className={`flex items-center rounded-full bg-subColor p-1 transition-colors duration-200 hover:opacity-95`}
          w={{ base: width || 'max-content', sm: width || 222 }}
          pr={{ sm: 40, md: 0 }}
        >
          <Flex justify={'space-between'} align={'center'} gap={7} w={'100%'}>
            <Flex align={'center'} wrap={'nowrap'} gap={7} flex={1}>
              <Box pos={'relative'} w={30} h={30} className='overflow-hidden rounded-full'>
                <Image
                  className='rounded-full object-cover'
                  width={30}
                  height={30}
                  src={session?.user?.image || '/images/webp/user-default.webp'}
                  alt='User avatar'
                />
              </Box>
              <Box className={`text-left ${responsive && 'hidden sm:block'}`} flex={1} pos={'relative'}>
                <Text fw={700} size='sm' lh={1} className='text-black' lineClamp={1}>
                  {session?.user?.name}
                </Text>
                <Text size='xs' fw={700} c={'dimmed'} lineClamp={1}>
                  {session?.user?.email}
                </Text>
              </Box>
            </Flex>
            <IconChevronDown
              style={{ width: 12, height: 12 }}
              stroke={1.5}
              className={`mr-4 text-gray-500 dark:text-dark-text ${responsive && 'hidden sm:block'}`}
            />
          </Flex>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown p={0} py={'lg'} className='shadow-xl'>
        <Stack px={'lg'}>
          <Title order={4} className='font-quicksand'>
            Tài khoản cá nhân
          </Title>
          <Flex align={'flex-start'} gap={'md'}>
            <Box
              w={80}
              h={80}
              className='overflow-hidden rounded-full border border-solid border-mainColor'
              pos={'relative'}
            >
              <Image
                src={session?.user?.image || '/images/png/403.png'}
                alt='User avatar'
                fill
                className='rounded-md object-cover'
              />
            </Box>
            <Stack gap={2}>
              <Text fw={700}> {session?.user?.name}</Text>
              <Text size='xs' py={2} px={8} className='w-fit rounded-full bg-mainColor/10 text-mainColor' fw={700}>
                {session?.user?.role === 'ADMIN'
                  ? 'Quản trị viên'
                  : session?.user?.role === 'STAFF'
                    ? 'Nhân viên'
                    : 'Khách hàng'}
              </Text>
              <Group align='center' gap={5}>
                <IconMail className='m-0 h-4 w-4 p-0 text-gray-600 dark:text-dark-text' />
                <Text size='sm' className='italic text-gray-600 dark:text-dark-text'>
                  {session?.user?.email}
                </Text>
              </Group>
            </Stack>
          </Flex>
        </Stack>
        <Box px={'lg'} mt={'md'}>
          <Divider />
        </Box>
        {menuUserInfo.map((item, index) => (
          <Link href={item.href} key={index}>
            <Box key={index} className='flex items-center gap-4 hover:bg-mainColor/10' px={'lg'} py={'sm'}>
              <Paper
                withBorder
                className='flex items-center justify-center bg-mainColor/10'
                w={40}
                h={40}
                radius={'md'}
              >
                <item.icon size={20} />
              </Paper>
              <Stack gap={2}>
                <Text fw={700}>{item.label}</Text>
                <Text size='xs' c={'dimmed'} fw={600}>
                  {item.des}
                </Text>
              </Stack>
            </Box>
          </Link>
        ))}
        <Box px={'lg'}>
          <Divider />
        </Box>
        <Box px={'lg'} mt={'md'}>
          <BButton
            fullWidth
            radius={'md'}
            className='bg-red-600 text-white'
            onClick={() => {
              resetCart();
              resetSelectedVouchers();
              signOut({ callbackUrl: '/' });
            }}
          >
            Đăng xuất
          </BButton>
        </Box>
      </Menu.Dropdown>
    </Menu>
  );
}
