import { Button, Indicator, rem } from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { api } from '~/trpc/react';

const LikeButton = () => {
  const { data: user } = useSession();
  const { data, isLoading } = api.FavouriteFood.getFilter.useQuery({ query: user?.user?.email || '' });

  return (
    <Link href={`/yeu-thich`}>
      <Button
        variant='outline'
        radius={'xl'}
        className='border-[#008b4b] text-[#008b4b] hover:bg-[#008b4b] hover:text-white'
        leftSection={
          <Indicator label={data?.length || 0} size={rem(15)} color={'green.9'} zIndex={100}>
            <IconHeart size={20} />
          </Indicator>
        }
      >
        Yêu thích
      </Button>
    </Link>
  );
};

export default LikeButton;
