'use client';
import { Box, Button, Paper } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconHeart } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useMemo } from 'react';
import { api } from '~/trpc/react';

const LikeButton = () => {
  const [localFavouriteFood] = useLocalStorage<any>({
    key: 'favouriteFood',
    defaultValue: []
  });
  const { data: session } = useSession();
  const user = session?.user;
  const { data: favouriteFoodFromApi = [] } = api.FavouriteFood.getFilter.useQuery(
    { s: user?.email || '' },
    { enabled: !!user?.email }
  );
  const dataRender = useMemo(() => {
    if (user?.email) return favouriteFoodFromApi;
    return localFavouriteFood;
  }, [user, favouriteFoodFromApi, localFavouriteFood]);

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
              {dataRender?.length || 0}
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
          {dataRender?.length || 0}
        </span>
      </Paper>
    </Link>
  );
};

export default LikeButton;
