import { Button } from '@mantine/core';
import { IconGift } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { api } from '~/trpc/react';

const PromotionButton = () => {
  const { data: user } = useSession();
  const { data, isLoading } = api.FavouriteFood.getFilter.useQuery({ query: user?.user?.email || '' });

  return (
    <Link href={`/khuyen-mai`}>
      <Button
        variant='outline'
        className='border-[#008b4b] text-[#008b4b] hover:bg-[#008b4b] hover:text-white'
        radius={'xl'}
        leftSection={<IconGift size={20} />}
      >
        Khuyến mãi
      </Button>
    </Link>
  );
};

export default PromotionButton;
