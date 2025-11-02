'use client';
import { Box, Button, Flex, Menu, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconCaretDown } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import MegaMenu from '~/app/(web)/thuc-don/components/MegaMenu';

const navigationItem = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Thực đơn', href: '/thuc-don' },
  { label: 'Về PhungFood', href: '/gioi-thieu' },
  { label: 'Liên Hệ', href: '/lien-he' },
  { label: 'Tin tức', href: '/tin-tuc' },
  { label: 'Mua nhanh', href: '/goi-mon-nhanh' }
];
function NavigationHeader({ categories }: { categories?: any }) {
  const [imgMounted, setImgMounted] = useState(false);
  const pathname = usePathname();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <Flex gap={'md'} align={'center'} style={{ transition: 'all 0.3s' }} className='hidden md:flex'>
      {navigationItem.map((item, index) =>
        item.href === '/thuc-don' ? (
          <Menu
            radius={'md'}
            key={index}
            trigger={'hover'}
            withOverlay
            onOpen={() => {
              setImgMounted(true);
              document.body.style.overflow = 'hidden';
            }}
            onClose={() => {
              document.body.style.overflow = '';
            }}
            overlayProps={{
              zIndex: 99
            }}
            disabled={!isDesktop || !categories?.length}
            width={1000}
            offset={0}
            transitionProps={{ transition: 'fade-up', duration: 300 }}
          >
            <Menu.Target>
              <Link key={index} href={item.href} style={{ transition: 'all 0.3s' }} className='h-[max-content]'>
                <Button
                  size='sm'
                  radius={'xl'}
                  variant='subtle'
                  px={'md'}
                  className={`transition duration-200 ease-in-out hover:bg-mainColor hover:text-white ${
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
            </Menu.Target>
            <Menu.Dropdown className='dark:bg-dark-background'>
              {imgMounted ? <MegaMenu categories={categories} /> : <Box></Box>}
            </Menu.Dropdown>
          </Menu>
        ) : (
          <Link key={index} href={item.href} className='h-[max-content]'>
            <Button
              size='sm'
              radius={'xl'}
              variant='subtle'
              px={'md'}
              className={`text-mainColor duration-200 ease-in-out hover:bg-mainColor hover:text-white ${
                pathname === item.href
                  ? 'bg-mainColor text-white'
                  : 'bg-[#f1faf6] text-mainColor dark:bg-dark-card dark:hover:bg-mainColor'
              } ${item.href === '/goi-mon-nhanh' ? 'animate-wiggle bg-red-600 text-white dark:bg-red-600' : ''} `}
              rightSection={item.href === '/thuc-don' && <IconCaretDown size={18} />}
            >
              <Text fw={700} size='sm'>
                {item.label}
              </Text>
            </Button>
          </Link>
        )
      )}
    </Flex>
  );
}

export default NavigationHeader;
