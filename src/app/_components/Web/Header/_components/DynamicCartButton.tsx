'use client';
import { Box } from '@mantine/core';
import clsx from 'clsx';
import useScrollPosition from '~/app/_components/Hooks/use-on-scroll';
import { HEIGHT_HEADER } from '~/app/lib/utils/constants/constant';
import CartButton from './gio-hang-button';

export default function DynamicCartButton() {
  const scroll = useScrollPosition(HEIGHT_HEADER);
  return (
    scroll >= HEIGHT_HEADER && (
      <Box className={clsx('animate-fadeTop')}>
        <CartButton />
      </Box>
    )
  );
}
