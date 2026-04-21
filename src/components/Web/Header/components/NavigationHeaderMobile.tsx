'use client';
import { Badge, Box, Button, Center, Divider, Drawer, Flex, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconCaretDown } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo } from 'react';
import Logo from '~/components/Logo';
import UserSection from '~/components/UserSection';
import { navigationClientItem } from '~/lib/ConfigUI';
import CartButton from './CartButton';
import PromotionButton from './PromotionButton';

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
      zIndex={10001}
      pos={'relative'}
      classNames={{
        close:
          'absolute right-[10px] top-[10px] flex h-[30px] w-[30px] items-center justify-center rounded-full bg-mainColor text-white'
      }}
    >
      <Drawer.Overlay />
      <Drawer.Content>
        <Drawer.Header py={0}>
          <Drawer.Title>
            <Link href={'/'}>
              <Center w={'100%'} flex={1}>
                <Logo width={100} height={50} />
              </Center>
            </Link>
          </Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>
        <Divider size={1} w={'100%'} pb={'md'} />
        <Drawer.Body pb={0}>
          <Box mb={20}>
            <UserSection width={'100%'} />
          </Box>

          <Flex gap={'md'} align={'center'} direction={{ base: 'column', md: 'row' }} mb={20}>
            {navigationClientItem.map((item, index) => (
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
                  className={`transition hover:bg-mainColor hover:text-white ${
                    pathname === item.href
                      ? 'bg-mainColor text-white'
                      : 'bg-[#f1faf6] text-mainColor dark:bg-dark-card dark:hover:bg-mainColor'
                  } `}
                  rightSection={item.href === '/thuc-don' && <IconCaretDown size={18} />}
                >
                  <Text fw={700} size='sm'>
                    {item.label}
                  </Text>
                </Button>
              </Link>
            ))}
            <Box pos={'relative'}>
              <PromotionButton />
              <Badge color='red' size='sm' className='absolute right-[-6px] top-[-8px] animate-wiggle'>
                Hot
              </Badge>
            </Box>
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
