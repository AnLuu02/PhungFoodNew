'use client';
import { Box, TextInput } from '@mantine/core';
import { useDebouncedCallback, useWindowEvent } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useRef } from 'react';

export default function Search() {
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

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <TextInput
      ref={searchInputRef}
      placeholder='Tìm kiếm'
      defaultValue={searchParams.get('query') || ''}
      onChange={event => handleSearch(event.currentTarget.value)}
      leftSection={<IconSearch size={16} className='text-gray-300' />}
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
      radius='md'
    />
  );
}
