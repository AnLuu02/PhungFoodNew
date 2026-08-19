'use client';
import { Box } from '@mantine/core';
import { memo } from 'react';

const CardProductWrapper = ({ children, slug }: { children: React.ReactNode; slug: string }) => {
  // const utils = api.useUtils();
  // const handlePrefetch = useCallback(() => {
  //   void utils.Product.getOne.prefetch({
  //     key: slug
  //   });
  // }, [slug]);

  return <Box>{children}</Box>;
};

export default memo(CardProductWrapper);
