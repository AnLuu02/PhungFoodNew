'use client';

import { Group, InputBase, Pill, Text } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import BButton from '~/components/Button';
const FILTER_LABELS: Record<string, string> = {
  tag: 'Thẻ',
  s: 'Tìm kiếm',
  sort: 'Sắp xếp',
  minPrice: 'Giá từ',
  maxPrice: 'Giá đến',
  'nguyen-lieu': 'Nguyên liệu',
  'danh-muc': 'Danh mục',
  'loai-san-pham': 'Loại sản phẩm',
  loai: 'Loại'
};
export default function ActiveFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const ignored = ['page', 'limit'];
  const activeFilters = useMemo(() => {
    return Array.from(params.entries()).filter(([key, value]) => value && !ignored.includes(key));
  }, [params]);

  if (activeFilters.length === 0) return null;

  const removeFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    const allValues = newParams.getAll(key);
    const updatedValues = allValues.filter(v => v !== value);
    newParams.delete(key);
    updatedValues.forEach(v => newParams.append(key, v));
    router.push(`?${newParams.toString()}`);
  };

  return (
    <>
      <InputBase component='div' multiline radius={'lg'} w={'100%'}>
        <Group gap={4}>
          <Text fw={700} size='sm'>
            Lọc:
          </Text>
          <Pill.Group>
            {activeFilters.map(([key, value]) => (
              <Pill key={key} withRemoveButton onRemove={() => removeFilter(key, value)} className='bg-mainColor/10'>
                {FILTER_LABELS[key] ?? key}: {decodeURIComponent(value)}
              </Pill>
            ))}
          </Pill.Group>
          {activeFilters?.length > 1 && (
            <BButton active label='Xóa tất cả' size='xs' onClick={() => router.push('/thuc-don')} radius={'lg'} />
          )}
        </Group>
      </InputBase>
    </>
  );
}
