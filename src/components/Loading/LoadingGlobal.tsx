'use client';

import { Box, Center, Flex, Image, Loader, Text } from '@mantine/core';
import { IconChefHat, IconCoffee, IconPizza, IconSalad } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function LoadingGlobal({ children }: { children?: React.ReactNode }) {
  const { status } = useSession();
  const isDone = status !== 'loading';
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (isDone) return <>{children ?? null}</>;

  return (
    <>
      <Flex align='center' justify='center' pos='fixed' inset={0} className='z-[10000] overflow-hidden bg-[#fffdf8]'>
        <Box className='absolute -left-24 top-10 h-80 w-80 animate-blob rounded-full bg-orange-300/20 blur-3xl' />
        <Box className='absolute -right-24 bottom-0 h-96 w-96 animate-blob rounded-full bg-yellow-300/25 blur-3xl [animation-delay:2s]' />
        <Box className='absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 animate-blob rounded-full bg-green-300/10 blur-3xl [animation-delay:4s]' />

        <Box
          className='absolute inset-0 opacity-[0.035]'
          style={{
            backgroundImage:
              'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
            backgroundSize: '42px 42px'
          }}
        />

        <Box className='absolute left-[8%] top-[18%] hidden animate-float text-orange-300/45 md:block'>
          <IconChefHat size={120} stroke={1.3} />
        </Box>
        <Box className='absolute right-[12%] top-[22%] hidden animate-float text-yellow-400/45 [animation-delay:1s] md:block'>
          <IconCoffee size={96} stroke={1.3} />
        </Box>
        <Box className='absolute bottom-[17%] left-[14%] hidden animate-float text-green-400/40 [animation-delay:2s] md:block'>
          <IconSalad size={110} stroke={1.3} />
        </Box>
        <Box className='absolute bottom-[14%] right-[16%] hidden animate-float text-red-300/40 [animation-delay:3s] md:block'>
          <IconPizza size={116} stroke={1.3} />
        </Box>

        <Box className='relative z-[10001] w-[340px] text-center sm:w-[380px]'>
          <Flex justify='center'>
            <Image src='/images/gif/loading.gif' w={150} h={150} fit='contain' alt='loading' />
          </Flex>

          <Text
            fw={800}
            size='xl'
            className='bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent'
            mt='sm'
          >
            Phụng Food Restaurant
          </Text>

          <Text size='sm' c='dimmed' mt={4}>
            Đang đồng bộ dữ liệu người dùng...
          </Text>

          <Center>
            <Loader mt='sm' color='orange' size='md' type='dots' />
          </Center>
        </Box>
      </Flex>
    </>
  );
}
