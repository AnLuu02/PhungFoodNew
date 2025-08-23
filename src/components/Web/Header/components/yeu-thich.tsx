'use client';
import { Box, Button } from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { api } from '~/trpc/react';

const LikeButton = () => {
  const { data: user } = useSession();
  const { data } = user?.user?.email
    ? api.FavouriteFood.getFilter.useQuery({ s: user?.user?.email || '' })
    : { data: [] };
  return (
    <Link href={`/yeu-thich`}>
      <Button
        variant='outline'
        radius={'xl'}
        className='border-mainColor text-mainColor hover:bg-mainColor hover:text-white'
        leftSection={
          <Box className='relative inline-block'>
            <IconHeart size={20} />
            <span className='absolute -right-2 -top-2 z-[100] flex h-[15px] w-[15px] items-center justify-center rounded-full bg-mainColor text-[10px] font-bold text-white'>
              {data?.length || 0}
            </span>
          </Box>
        }
      >
        Yêu thích
      </Button>
    </Link>
  );
};

export default LikeButton;
