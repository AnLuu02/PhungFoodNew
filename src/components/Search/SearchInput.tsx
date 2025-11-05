'use client';
import { Box, TextInput } from '@mantine/core';
import { useDebouncedCallback, useWindowEvent } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function SearchInput({ width }: { width?: string | number | undefined }) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useWindowEvent('keydown', event => {
    if (event.key === '/') {
      event.preventDefault();
      searchInputRef.current?.focus();
    }
  });

  useEffect(() => {
    if (!searchParams.get('s') && searchInputRef.current) {
      searchInputRef.current.value = '';
    }
  }, [searchParams.get('s')]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('s', term);
    } else {
      params.delete('s');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <TextInput
      ref={searchInputRef}
      placeholder='Tìm kiếm'
      defaultValue={searchParams.get('s') || ''}
      onChange={event => handleSearch(event.currentTarget.value)}
      leftSection={<IconSearch size={16} className='text-gray-300 dark:text-dark-text' />}
      rightSectionWidth={40}
      w={width}
      rightSection={
        <Box
          style={{
            fontSize: '10px',
            padding: '4px 10px',
            border: '0.5px solid rgba(0, 0, 0, 0.2)',
            boxShadow: '1px 2px 0 rgba(0, 0, 0, 0.2)',
            borderRadius: '6px',
            fontWeight: 'bold'
          }}
          size='xs'
          c='dimmed'
        >
          /
        </Box>
      }
      radius='md'
    />
  );
}
