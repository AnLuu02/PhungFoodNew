import { Button } from '@mantine/core';
import { IconGift } from '@tabler/icons-react';
import Link from 'next/link';

const PromotionButton = () => {
  return (
    <Link href={`/khuyen-mai`}>
      <Button
        variant='outline'
        className='hover:bg-mainColor text-mainColor border-mainColor hover:text-white'
        radius={'xl'}
        leftSection={<IconGift size={20} />}
      >
        Khuyến mãi
      </Button>
    </Link>
  );
};

export default PromotionButton;
