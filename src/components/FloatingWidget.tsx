import { Box, Center, Menu, MenuDropdown, MenuItem, MenuTarget } from '@mantine/core';
import { IconMessageCircle } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import Chatbox from './Web/components/Chatbox';

export default async function FloatingWidget() {
  return (
    <>
      <Box pos={'fixed'} bottom={100} left={20} className='z-[9999] flex flex-col space-y-4'>
        <Menu shadow='md' width={'max-content'} position='top-start' offset={0} zIndex={10000}>
          <MenuTarget>
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
          </MenuTarget>

          <MenuDropdown
            className='overflow-hidden rounded-md bg-white shadow-md'
            ml={{ base: 0, sm: 40, md: 40, lg: 40 }}
            p={0}
          >
            <Chatbox />
          </MenuDropdown>
        </Menu>
      </Box>
      <Box pos={'fixed'} bottom={100} right={20} className='z-[9999] flex flex-col space-y-4'>
        <Menu shadow='md' width={250} position='top'>
          <MenuTarget>
            <Center
              className='relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-[#008b4b] text-white duration-200 ease-in-out hover:opacity-80'
              w={50}
              h={50}
            >
              <Image
                src={'/images/svg/icon-lienhe.svg'}
                alt='phone'
                width={32}
                style={{ objectFit: 'cover' }}
                height={32}
                loading='lazy'
                className='animate-wiggle'
              />
              <span className='absolute z-[-1] h-full w-full animate-pulse rounded-full bg-green-300 opacity-0'></span>
              <span className='absolute z-[-1] h-[80%] w-[80%] animate-pulse rounded-full bg-green-500 opacity-25'></span>
              <span className='absolute z-[-1] h-[60%] w-[60%] animate-pulse rounded-full bg-green-700 opacity-50'></span>
            </Center>
          </MenuTarget>

          <MenuDropdown className='rounded-lg bg-white shadow-md' py={5}>
            <MenuItem
              leftSection={<Image src={'/images/svg/icon-phone.svg'} alt='phone' width={24} height={24} />}
              component='a'
              href='tel:0123456789'
            >
              Gọi ngay cho chúng tôi
            </MenuItem>
            <MenuItem
              leftSection={<Image src={'/images/svg/icon-zalo.svg'} alt='zalo' width={24} height={24} />}
              component='a'
              href='https://zalo.me/your-zalo-id'
              target='_blank'
            >
              Chat với chúng tôi qua Zalo
            </MenuItem>
            <MenuItem
              leftSection={<Image src={'/images/svg/icon-location.svg'} alt='location' width={24} height={24} />}
              component='a'
              href='https://maps.google.com?q=your-location'
              target='_blank'
            >
              Vị trí cửa hàng
            </MenuItem>
          </MenuDropdown>
        </Menu>

        <Link href='https://m.me/your-facebook-page' target='_blank'>
          <Image
            loading='lazy'
            src={'/images/svg/icon-messager.svg'}
            width={50}
            height={50}
            style={{ objectFit: 'cover' }}
            alt='messager'
            className='animate-wiggle'
          />
        </Link>
      </Box>
    </>
  );
}
