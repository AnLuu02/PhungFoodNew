'use client';

import { Button, Divider, Group, Paper, Select, SimpleGrid, TextInput, Transition } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';

import { useEffect, useState } from 'react';
import { ActivityFilters } from '../page';

export default function ActivityFilter({
  showFilters,
  onFilters
}: {
  showFilters: boolean;
  onFilters: (filters: ActivityFilters) => void;
}) {
  const [filters, setFilters] = useState<ActivityFilters>({});
  const [debouceValue] = useDebouncedValue(filters, 800);
  useEffect(() => {
    onFilters(debouceValue);
  }, [debouceValue]);
  return (
    <Transition transition='slide-left' mounted={true}>
      {transitionStyles => (
        <Paper
          radius='xl'
          p='0'
          shadow='md'
          px={'lg'}
          style={transitionStyles}
          className='animate-in slide-in-from-top-2 bg-cardAdmin transition-all duration-200 ease-out dark:bg-dark-card'
        >
          <Group gap='md'>
            <TextInput
              placeholder='Tìm kiếm theo người dùng, đối tượng hoặc chi tiết...'
              leftSection={<IconSearch size={18} />}
              value={filters.search || ''}
              onChange={e => setFilters({ ...filters, search: e.target.value || undefined })}
              size='sm'
              flex={1}
              py={'xs'}
              classNames={{
                input: 'border-none bg-cardAdmin dark:bg-dark-card'
              }}
            />
            <Divider w={1} size={30} c={'red'} />
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='md'>
              <Select
                placeholder='Đối tượng'
                data={[
                  { value: 'Order', label: 'Đặt hàng' },
                  { value: 'MenuItem', label: 'Mục thực đơn' },
                  { value: 'User', label: 'Người dùng' }
                ]}
                classNames={{
                  input: 'border-none bg-cardAdmin dark:bg-dark-card'
                }}
                value={filters.entityType || null}
                onChange={v => setFilters({ ...filters, entityType: v || undefined })}
                clearable
              />
              <Select
                placeholder='Hành động'
                data={[
                  { value: 'create', label: 'Tạo mới' },
                  { value: 'update', label: 'Chỉnh sữa' },
                  { value: 'delete', label: 'Xóa' },
                  { value: 'view', label: 'Xem' }
                ]}
                classNames={{
                  input: 'border-none bg-cardAdmin dark:bg-dark-card'
                }}
                value={filters.action || null}
                onChange={v => setFilters({ ...filters, action: v || undefined })}
                clearable
              />
            </SimpleGrid>

            <Group justify='flex-end'>
              <Button
                variant='subtle'
                onClick={() => setFilters({})}
                color={Object.values(filters).length > 0 ? '' : 'gray'}
              >
                Xóa tất cả bộ lọc
              </Button>
            </Group>
          </Group>
        </Paper>
      )}
    </Transition>
  );
}
