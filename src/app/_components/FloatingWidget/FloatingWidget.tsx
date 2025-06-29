'use client';

import { Box, Center, Menu } from '@mantine/core';
import { IconMessageCircle } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Chatbox from '../Web/_components/Chatbox';

export default function FloatingWidget() {
  const pathname = usePathname();
  return (
    !pathname.includes('admin') && (
      <>
        <Box pos={'fixed'} bottom={100} left={20} className='z-[9999] flex flex-col space-y-4'>
          <Menu shadow='md' width={'max-content'} position='top-start' offset={0} zIndex={10000}>
            <Menu.Target>
              <Center
                className='relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-[#008b4b] text-white duration-200 ease-in-out hover:opacity-80'
                w={50}
                h={50}
              >
                <IconMessageCircle size={24} className='animate-wiggle' />
                <span className='absolute z-[-1] h-full w-full animate-pulse rounded-full bg-green-300 opacity-0'></span>
                <span className='absolute z-[-1] h-[80%] w-[80%] animate-pulse rounded-full bg-green-500 opacity-25'></span>
                <span className='absolute z-[-1] h-[60%] w-[60%] animate-pulse rounded-full bg-green-700 opacity-50'></span>
              </Center>
            </Menu.Target>

            <Menu.Dropdown
              className='overflow-hidden rounded-md bg-white shadow-md'
              ml={{ base: 0, sm: 40, md: 40, lg: 40 }}
              p={0}
            >
              <Chatbox />
            </Menu.Dropdown>
          </Menu>
        </Box>
        <Box pos={'fixed'} bottom={100} right={20} className='z-[9999] flex flex-col space-y-4'>
          <Menu shadow='md' width={250} position='top'>
            <Menu.Target>
              <Center
                className='relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-[#008b4b] text-white duration-200 ease-in-out hover:opacity-80'
                w={50}
                h={50}
              >
                <Image
                  src={'/images/svg/icon-lienhe.svg'}
                  alt='phone'
                  width={32}
                  objectFit='cover'
                  height={32}
                  loading='lazy'
                  className='animate-wiggle'
                />
                <span className='absolute z-[-1] h-full w-full animate-pulse rounded-full bg-green-300 opacity-0'></span>
                <span className='absolute z-[-1] h-[80%] w-[80%] animate-pulse rounded-full bg-green-500 opacity-25'></span>
                <span className='absolute z-[-1] h-[60%] w-[60%] animate-pulse rounded-full bg-green-700 opacity-50'></span>
              </Center>
            </Menu.Target>

            <Menu.Dropdown className='rounded-lg bg-white shadow-md' py={5}>
              <Menu.Item
                leftSection={<Image src={'/images/svg/icon-phone.svg'} alt='phone' width={24} height={24} />}
                component='a'
                href='tel:0123456789'
              >
                Gọi ngay cho chúng tôi
              </Menu.Item>
              <Menu.Item
                leftSection={<Image src={'/images/svg/icon-zalo.svg'} alt='zalo' width={24} height={24} />}
                component='a'
                href='https://zalo.me/your-zalo-id'
                target='_blank'
              >
                Chat với chúng tôi qua Zalo
              </Menu.Item>
              <Menu.Item
                leftSection={<Image src={'/images/svg/icon-location.svg'} alt='location' width={24} height={24} />}
                component='a'
                href='https://maps.google.com?q=your-location'
                target='_blank'
              >
                Vị trí cửa hàng
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          <Link href='https://m.me/your-facebook-page' target='_blank' prefetch={false}>
            <Image
              loading='lazy'
              src={'/images/svg/icon-messager.svg'}
              width={50}
              height={50}
              objectFit='cover'
              alt='messager'
              className='animate-wiggle'
            />
          </Link>
        </Box>
      </>
    )
  );
}
