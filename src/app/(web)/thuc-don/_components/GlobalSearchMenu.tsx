'use client';
import { Avatar, Box, ScrollAreaAutosize, TextInput } from '@mantine/core';
import { useDebouncedValue, useWindowEvent } from '@mantine/hooks';
import { Spotlight, spotlight, SpotlightActionData } from '@mantine/spotlight';
import { IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '~/trpc/react';
import GlobalSearchItem from './GlobalSearchItem';

function GlobalSearchMenu({ width }: { width?: any }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [debounced] = useDebouncedValue(query, 500);
  const { data: product, isLoading: isLoadingProduct } = api.Product.find.useQuery(
    { skip: 0, take: 10, query: debounced ?? '' },
    { enabled: !!debounced }
  );

  const items = (product?.products || []).map(item => <GlobalSearchItem key={item.id} item={item} query={query} />);
  useWindowEvent('keydown', event => {
    if (event.ctrlKey && event.key === 'k') {
      event.preventDefault();
      spotlight.open();
    }
  });
  const actions: SpotlightActionData[] = [
    {
      id: 'rice',
      label: 'Cơm',
      description: 'Đặt món cơm ngon nhất tại đây',
      onClick: () => {
        router.push('/thuc-don?loai=com');
      },
      leftSection: <Avatar size={24} src='/images/png/icon-rice.png' />
    },
    {
      id: 'meat',
      label: 'Thịt',
      description: 'Đặt món thịt ngon nhất tại đây',
      onClick: () => {
        router.push('/thuc-don?loai=thit-tuoi');
      },
      leftSection: <Avatar size={24} src='/images/png/icon-meat.png' />
    },
    {
      id: 'vegetable',
      label: 'Rau củ',
      description: 'Đặt món rau củ ngon nhất tại đây',
      onClick: () => {
        router.push('/thuc-don?loai=rau-cu');
      },
      leftSection: <Avatar size={24} src='/images/png/icon-vegetable.png' />
    }
  ];
  return (
    <>
      <TextInput
        placeholder='Search...'
        leftSection={<IconSearch size={24} className='text-gray-300' />}
        rightSectionWidth={80}
        pointer
        className='rounded-full'
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
            Ctrl + K
          </Box>
        }
        radius={'30px'}
        readOnly
        w={width}
        onClick={spotlight.open}
      />

      <Spotlight.Root query={query} onQueryChange={setQuery}>
        <Spotlight.Search placeholder='Tìm kiếm...' leftSection={<IconSearch stroke={1.5} />} />
        {items && !items?.length && (
          <Spotlight.ActionsList>
            {actions.map((action, index) => (
              <Spotlight.Action key={index} {...action} />
            ))}
          </Spotlight.ActionsList>
        )}
        <ScrollAreaAutosize mah={500} scrollbarSize={5}>
          {items.length > 0 ? items : debounced && <Spotlight.Empty>Không tìm thấy sản phẩm...</Spotlight.Empty>}
        </ScrollAreaAutosize>
      </Spotlight.Root>
    </>
  );
}

export default GlobalSearchMenu;
