'use client';
import { Group, Select, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconFilter, IconSearch } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { FilterPermission } from '../types';

export default function FilterSection({
  onFilterValue,
  onSearchValue
}: {
  onFilterValue: (filter: FilterPermission) => void;
  onSearchValue: (value: string) => void;
}) {
  const [searchValue, setSearchValue] = useState('');
  const [filter, setFilter] = useState<FilterPermission>();
  const [searchDebouceValue] = useDebouncedValue(searchValue, 1000);

  useEffect(() => {
    onSearchValue(searchDebouceValue);
  }, [searchDebouceValue]);

  useEffect(() => {
    onFilterValue(filter);
  }, [filter]);
  return (
    <Group align='center' gap={'md'}>
      <TextInput
        leftSection={<IconSearch size={16} className='text-gray-300 dark:text-dark-text' />}
        size='sm'
        value={searchValue}
        onChange={event => setSearchValue(event.currentTarget.value)}
        placeholder='Tìm kiếm'
      />
      <Select
        size='sm'
        data={[
          { value: 'view:', label: 'Quyền xem' },
          { value: 'create:', label: 'Quền tạo mới' },
          { value: 'update:', label: 'Quyền cập nhật' },
          { value: 'delete:', label: 'Quyền xóa' },
          { value: 'hasNotPermission', label: 'Quyền chưa có' },
          { value: 'hasPermission', label: 'Quyền hiện có' }
        ]}
        value={filter}
        leftSection={<IconFilter size={16} className='text-gray-300 dark:text-dark-text' />}
        placeholder='Lọc theo quyền'
        onChange={value => setFilter(value as any)}
      />
    </Group>
  );
}
