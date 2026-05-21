'use client';

import { Box } from '@mantine/core';

type ComingSoonVariant = 'page' | 'section';

type ComingSoonProps = {
  variant?: ComingSoonVariant;
  badge?: string;
  title?: string;
  highlightText?: string;
  description?: string;
  backgroundImage?: string;
  showSocials?: boolean;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
};

export default function ComingSoon({
  variant = 'page',
  backgroundImage = '/images/png/coming-soon-food-banner.png'
}: ComingSoonProps) {
  const isPage = variant === 'page';

  return (
    <Box
      component='section'
      className={['relative overflow-hidden bg-black', isPage ? 'min-h-screen' : 'min-h-[520px] rounded-3xl'].join(' ')}
    >
      <Box
        className='absolute inset-0 bg-cover bg-center bg-no-repeat'
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
    </Box>
  );
}
