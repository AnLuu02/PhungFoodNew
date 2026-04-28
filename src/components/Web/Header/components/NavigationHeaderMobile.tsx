'use client';
import {
  Badge,
  Box,
  Center,
  Divider,
  Drawer,
  Flex,
  Grid,
  GridCol,
  Group,
  Image,
  NavLink,
  Paper,
  Text
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconHome2, IconSoup } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { memo } from 'react';
import Logo from '~/components/Logo';
import UserSection from '~/components/UserSection';
import { navigationClientItem } from '~/lib/ConfigUI';
import CartButton from './CartButton';
import PromotionButton from './PromotionButton';

function NavigationHeaderMobile({
  opened,
  categories,
  close
}: {
  opened?: boolean;
  categories?: any;
  close?: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  if (isDesktop) {
    return;
  }
  const categoryForMenu = categories ?? [];
  return (
    <Drawer.Root
      opened={opened || false}
      onClose={() => {
        close?.();
      }}
      size={'xs'}
      zIndex={10001}
      pb={'md'}
      pos={'relative'}
      classNames={{
        close:
          'absolute right-[10px] top-[10px] flex h-[30px] w-[30px] items-center justify-center rounded-full bg-mainColor text-white'
      }}
    >
      <Drawer.Overlay />
      <Drawer.Content>
        <Drawer.Header py={0} pt={'xs'}>
          <Drawer.Title>
            <Link href={'/'}>
              <div className='flex h-16 items-center justify-center'>
                <Logo className='h-4/5 w-auto text-mainColor' />
              </div>
            </Link>
          </Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>
        <Center mt={'sm'} mb={'md'}>
          <Divider
            variant='dashed'
            size={'sm'}
            w={'100%'}
            classNames={{
              root: 'border-mainColor'
            }}
            labelPosition='center'
            label={
              <>
                <IconHome2 size={12} className='italic' />
                <Box ml={5} className='italic'>
                  PhungFoodRes
                </Box>
              </>
            }
          />
        </Center>
        <Drawer.Body pb={0}>
          <Box mb={20}>
            <UserSection width={'100%'} />
          </Box>

          <Flex direction='column' gap='xs' className='mb-8'>
            {navigationClientItem.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return item.href === '/thuc-don' ? (
                <Box key={item?.href}>
                  <NavLink
                    key={item?.href}
                    label={
                      <Text fw={isActive ? 700 : 500} size='sm'>
                        {item.label}
                      </Text>
                    }
                    leftSection={<Icon size={16} />}
                    className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 ease-in-out ${
                      isActive
                        ? 'bg-mainColor/20 text-mainColor dark:bg-mainColor/10'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Box className={`border-0 border-l border-solid border-gray-300 pl-2`}>
                      {categoryForMenu.map((child: any) => (
                        <Link key={child?.tag} href={`/thuc-don?danh-muc=${child?.tag}`} onClick={() => close?.()}>
                          <Paper
                            key={child?.tag}
                            py={'xs'}
                            pl={'md'}
                            w={'100%'}
                            className={`${child?.tag === searchParams.get('danh-muc') ? 'bg-mainColor/10' : ''} my-1 hover:bg-mainColor/10`}
                          >
                            <Text size='sm' fw={700}>
                              {child?.name || 'Đang cập nhật'}
                            </Text>
                          </Paper>
                        </Link>
                      ))}
                    </Box>
                  </NavLink>
                </Box>
              ) : (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => close?.()}
                  className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 ease-in-out ${
                    isActive
                      ? 'bg-mainColor/20 text-mainColor dark:bg-mainColor/10'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-dark-card'
                  }`}
                >
                  <Group>
                    <Icon size={16} />
                    <Text fw={isActive ? 700 : 500} size='sm'>
                      {item.label}
                    </Text>
                  </Group>

                  {item.href === '/goi-mon-nhanh' && <IconSoup size={18} className='animate-wiggle text-red-600' />}
                </Link>
              );
            })}
          </Flex>

          <Flex gap='md'>
            <Box className='relative flex-1'>
              <PromotionButton />
              <Badge color='red' size='sm' variant='filled' className='absolute -right-2 -top-2 animate-wiggle'>
                Hot
              </Badge>
            </Box>
            <Box className='flex-1'>
              <CartButton notResponsive={true} />
            </Box>
          </Flex>

          <Flex direction={'column'} justify={'center'} align={'center'} mt={'lg'}>
            <Divider
              variant='dashed'
              size={'sm'}
              w={'80%'}
              classNames={{
                root: 'border-mainColor'
              }}
              mb={'md'}
              labelPosition='center'
              label={
                <>
                  <Box ml={5} className='italic'>
                    Tải ứng dụng ngay
                  </Box>
                </>
              }
            />
            <Grid p={0} w={'100%'}>
              <GridCol span={6}>
                <Link href='#' className='relative w-full'>
                  <Image
                    loading='lazy'
                    src='/images/png/logo_playstore.png'
                    alt='Google Play'
                    w={'100%'}
                    h={36}
                    className='relative object-cover transition-transform hover:scale-105'
                  />
                </Link>
              </GridCol>
              <GridCol span={6}>
                <Link href='#' className='relative w-full'>
                  <Image
                    loading='lazy'
                    src='/images/png/logo_appstore.png'
                    alt='App Store'
                    w={'100%'}
                    h={36}
                    className='relative object-cover transition-transform hover:scale-105'
                  />
                </Link>
              </GridCol>
            </Grid>
          </Flex>
          <Text ta='center' size='xs' c='dimmed' mt='xl' mb={'xs'}>
            © 2026 Phung Food. Design by An Luu
          </Text>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
}

export default memo(NavigationHeaderMobile);
