'use client';
import { Box } from '@mantine/core';
import clsx from 'clsx';
import useScrollPosition from '~/components/Hooks/use-on-scroll';
import { HEIGHT_HEADER } from '~/constants';
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
