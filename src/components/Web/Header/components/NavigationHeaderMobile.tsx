'use client';
import { ActionIcon, Box, Button, Center, Drawer, Flex, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconCaretDown, IconX } from '@tabler/icons-react';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo } from 'react';
import Logo from '~/components/Logo';
import UserSection from '~/components/UserSection';
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
        <Drawer.Header py={0}>
          <Drawer.Title>
            <Link href={'/'}>
              <Center w={'100%'} flex={1}>
                <Logo width={200} />
              </Center>
            </Link>
          </Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>
        <Drawer.Body pb={0}>
          <ActionIcon bg={'red'} c='black' pos={'absolute'} top={10} right={10} onClick={close} className='z-[99]'>
            <IconX size={20} color='black' />
          </ActionIcon>

          <Box mb={20}>
            <UserSection width={'100%'} />
          </Box>

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

          <Box className='flex justify-center gap-4 md:justify-start'>
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
