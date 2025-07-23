import { Box, Button, Center, Menu, MenuDropdown, MenuItem, MenuTarget } from '@mantine/core';
import { IconChevronCompactLeft, IconMessageCircle } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '~/trpc/server';
import Chatbox from './Web/components/Chatbox';

export default async function FloatingWidget() {
  const restaurant = await api.Restaurant.getOne();
  return (
    <>
      <Box pos={'fixed'} bottom={100} left={20} className='z-[9999] flex flex-col space-y-4'>
        <Menu shadow='md' width={'max-content'} position='top-start' offset={0} zIndex={10000}>
          <MenuTarget>
            <Center
              className='relative hidden h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-mainColor text-white duration-200 ease-in-out hover:opacity-80 sm:flex'
              w={50}
              h={50}
            >
              <IconMessageCircle size={24} className='animate-wiggle' />
              <span className='absolute z-[-1] h-full w-full animate-ping rounded-full bg-mainColor opacity-10'></span>
              <span className='absolute z-[-1] h-[80%] w-[80%] animate-ping rounded-full bg-mainColor opacity-20'></span>
              <span className='absolute z-[-1] h-[60%] w-[60%] animate-ping rounded-full bg-mainColor opacity-30'></span>
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
      <Box pos={'fixed'} bottom={100} right={{ base: -15, sm: 20 }} className='z-[9999] flex flex-col space-y-4'>
        <Menu shadow='md' width={250} position='top'>
          <MenuTarget>
            <Box>
              <Center
                className='relative hidden h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-mainColor text-white duration-200 ease-in-out hover:opacity-80 sm:flex'
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
                <span className='absolute z-[-1] h-full w-full animate-ping rounded-full bg-mainColor opacity-10'></span>
                <span className='absolute z-[-1] h-[80%] w-[80%] animate-ping rounded-full bg-mainColor opacity-20'></span>
                <span className='absolute z-[-1] h-[60%] w-[60%] animate-ping rounded-full bg-mainColor opacity-30'></span>
              </Center>

              <Button
                variant='outline'
                className='border-mainColor text-mainColor sm:hidden'
                radius={'md'}
                p={4}
                size='md'
                leftSection={<IconChevronCompactLeft size={24} className='' />}
              ></Button>
            </Box>
          </MenuTarget>

          <MenuDropdown className='rounded-lg bg-white shadow-md dark:bg-dark-background' py={5}>
            <MenuItem
              leftSection={<Image src={'/images/svg/icon-phone.svg'} alt='phone' width={24} height={24} />}
              component='a'
              href={`tel:${restaurant?.phone || '0911862581'}`}
            >
              Gọi ngay cho chúng tôi
            </MenuItem>

            <MenuItem
              leftSection={<Image src={'/images/svg/icon-zalo.svg'} alt='zalo' width={24} height={24} />}
              component='a'
              href={`https://zalo.me/${restaurant?.phone || '0918064618'}`}
              target='_blank'
            >
              Nhắn với chúng tôi qua Zalo
            </MenuItem>

            <MenuItem
              leftSection={<Image src={'/images/svg/icon-messager.svg'} alt='zalo' width={24} height={24} />}
              component='a'
              href={`https://m.me/${restaurant?.socials.find(item => item.key === 'facebook')?.url || 'anluu099'}`}
              target='_blank'
            >
              Nhắn với chúng tôi qua Messenger
            </MenuItem>
            <MenuItem
              leftSection={<Image src={'/images/svg/icon-location.svg'} alt='location' width={24} height={24} />}
              component='a'
              target='_blank'
              href={`https://www.google.com/maps/search/?api=1&query=${restaurant?.address}`}
            >
              Vị trí cửa hàng
            </MenuItem>
          </MenuDropdown>
        </Menu>

        <Link
          href={`https://m.me/${restaurant?.socials.find(item => item.key === 'facebook')?.url || 'anluu099'}`}
          target='_blank'
          className='hidden sm:block'
        >
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
