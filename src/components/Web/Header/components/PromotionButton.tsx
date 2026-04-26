import { IconGift } from '@tabler/icons-react';
import Link from 'next/link';
import BButton from '~/components/Button/Button';

const PromotionButton = () => {
  return (
    <Link href={`/khuyen-mai`}>
      <BButton variant='outline' radius={'xl'} leftSection={<IconGift size={20} />}>
        Khuyến mãi
      </BButton>
    </Link>
  );
};

export default PromotionButton;
