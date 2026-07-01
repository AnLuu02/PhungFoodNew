'use client';
import { Box, Button, Paper } from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';
import Link from 'next/link';
import { useFavoriteCount } from '~/components/Hooks/use-favorite';

const LikeButton = () => {
  const count = useFavoriteCount();
  return (
    <Link href={`/yeu-thich`}>
      <Button
        variant='outline'
        radius={'xl'}
        className='sm:hidden md:block'
        leftSection={
          <Box className='relative inline-block'>
            <IconHeart size={20} />
            <span className='absolute -right-2 -top-2 z-[100] flex h-[15px] w-[15px] items-center justify-center rounded-full bg-mainColor text-[10px] font-bold text-white'>
              {count}
            </span>
          </Box>
        }
      >
        Yêu thích
      </Button>
      <Paper
        w={40}
        h={40}
        radius={'lg'}
        withBorder
        className='relative hidden items-center justify-center text-mainColor sm:flex md:hidden'
      >
        <IconHeart size={24} />
        <span className='absolute -right-2 -top-2 z-[100] flex h-[15px] w-[15px] items-center justify-center rounded-full bg-mainColor text-[10px] font-bold text-white'>
          {count}
        </span>
      </Paper>
    </Link>
  );
};

export default LikeButton;
