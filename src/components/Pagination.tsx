'use client';
import { Group, Pagination } from '@mantine/core';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function CustomPagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get('page')) || 1;
  const onChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);

    if (newPage <= 1) {
      params.delete('page');
    } else {
      params.set('page', newPage.toString());
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (totalPages <= 1) return null;
  return (
    <Group justify='center'>
      <Pagination.Root
        classNames={{
          control:
            'hover:bg-mainColor/10 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white'
        }}
        total={totalPages}
        value={currentPage}
        onChange={onChange}
      >
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
