'use client';
import { Box, TextInput, TextInputProps } from '@mantine/core';
import { useDebouncedCallback, useWindowEvent } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function SearchInput(props: TextInputProps) {
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
    if (term) {
      params.set('s', term);
    } else {
      params.delete('s');
    }
    params.delete('page');
    const newRelativePathQuery = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    if (window.location.search !== `?${params.toString()}`) {
      router.replace(newRelativePathQuery, { scroll: false });
    }
  }, 500);

  return (
    <TextInput
      placeholder='Tìm kiếm'
      leftSection={<IconSearch size={16} className='text-gray-300 dark:text-dark-text' />}
      rightSectionWidth={40}
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
      {...props}
      ref={searchInputRef}
      defaultValue={searchParams.get('s') || ''}
      onChange={event => handleSearch(event.currentTarget.value)}
    />
  );
}
