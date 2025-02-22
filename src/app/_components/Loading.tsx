import { Box, Loader } from '@mantine/core';
import clsx from 'clsx';

export default function LoadingComponent() {
  return (
    <Box className={clsx(`my-10 flex h-full w-full items-center justify-center`)}>
      <Loader size='sm' />
    </Box>
  );
}
