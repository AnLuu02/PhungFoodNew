'use client';
import { Box, TextInput } from '@mantine/core';
import { useDebouncedCallback, useWindowEvent } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useRef } from 'react';

export default function SearchLocal({ setValue }: { setValue: (value: string) => void }) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useWindowEvent('keydown', event => {
    if (event.key === '/') {
      event.preventDefault();
      searchInputRef.current?.focus();
    }
  });

  const handleSearch = useDebouncedCallback((term: string) => {
    setValue(term);
  }, 500);

  return (
    <TextInput
      ref={searchInputRef}
      placeholder='Tìm kiếm'
      onChange={event => handleSearch(event.currentTarget.value)}
      leftSection={<IconSearch size={16} className='text-gray-300 dark:text-white' />}
      rightSectionWidth={40}
      w={'100%'}
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
