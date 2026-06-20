'use client';
import { Box } from '@mantine/core';
import { memo, useCallback } from 'react';
import { api } from '~/trpc/react';

const CardProductWrapper = ({ children, slug }: { children: React.ReactNode; slug: string }) => {
  const utils = api.useUtils();
  const handlePrefetch = useCallback(() => {
    void utils.Page.getInitProductDetail.prefetch({
      slug
    });
  }, [slug]);

  return <Box onMouseEnter={handlePrefetch}>{children}</Box>;
};

export default memo(CardProductWrapper);
