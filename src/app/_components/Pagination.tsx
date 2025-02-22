'use client';
import { Group, Pagination } from '@mantine/core';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function CustomPagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const router = useRouter();

  useEffect(() => {
    if (currentPage == 1 && !searchParams.get('query')) {
      const params = new URLSearchParams(searchParams);
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [currentPage, searchParams]);

  const onChange = (newPage: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.delete('page');
    if (Number(newPage) > 1) params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };
  return (
    <Group justify='center' mt='xl'>
      <Pagination.Root color='green.9' total={totalPages} value={currentPage} onChange={onChange}>
        <Group gap={5} justify='center'>
          <Pagination.First />
          <Pagination.Previous />
          <Pagination.Items />
          <Pagination.Next />
          <Pagination.Last />
        </Group>
      </Pagination.Root>
    </Group>
  );
}
