import { Box, Rating, Text } from '@mantine/core';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useEffect, useState } from 'react';

export const FilterRating = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [minRating, setMinRating] = useState<number>(+(searchParams.get('rating') || 0));
  useEffect(() => {
    setMinRating(Number(searchParams.get('rating') || 0));
  }, [searchParams]);
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.delete('rating');
    if (minRating) {
      params.set('rating', String(minRating));
    }
    router.push(`${pathname}?${params.toString()}`);
  }, [minRating]);
  return (
    <Box>
      <Text size='sm' fw={500} mb={'xs'}>
        Đánh giá
      </Text>
      <Rating size={'xl'} value={minRating} onChange={setMinRating} />
    </Box>
  );
};
