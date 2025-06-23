'use client';

import { Box } from '@mantine/core';
import { ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';

export default function LazySection({
  children,
  threshold = 0.1,
  margin = '200px 0px',
  once = true
}: {
  children: ReactNode;
  threshold?: number;
  margin?: string;
  once?: boolean;
}) {
  const { ref, inView } = useInView({
    triggerOnce: once,
    threshold,
    rootMargin: margin
  });

  return <Box ref={ref}>{inView ? children : null}</Box>;
}
