'use client';
import { Skeleton, Text } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import tags from '~/constants/tags-vi.json';
import { getTagFromQuery } from '~/lib/FuncHandler/generateTag';

export const ActiveMenuPageText = () => {
  const [isMounted, setIsMounted] = useState(false);
  const params = useSearchParams();
  const activeTag = useMemo(() => getTagFromQuery(params, tags), [params, tags]);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return <Skeleton h={36} w={93} className='mb-2' />;
  return (
    <Text size='sm' className='mb-2 text-center text-3xl font-bold text-green-400'>
      {activeTag}
    </Text>
  );
};
