import { Button } from '@mantine/core';
import { IconGift } from '@tabler/icons-react';
import Link from 'next/link';

const PromotionButton = () => {
  return (
    <Link href={`/khuyen-mai`} prefetch={false}>
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
