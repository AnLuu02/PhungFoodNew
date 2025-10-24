'use client';

import { Group, InputBase, Pill, Text } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import BButton from '~/components/Button/Button';
import { formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { getViTag } from '~/lib/func-handler/generateTag';

export default function ActiveFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const ignored = ['page', 'limit', 'maxPrice', 'minPrice', 's'];
  const activeFilters = useMemo(() => {
    let price = '';
    const dataFormat = Array.from(params.entries()).filter(([key, value]) => {
      if (key === 'minPrice') {
        price += 'Giá từ ' + formatPriceLocaleVi(value) + ' - ';
      }
      if (key === 'maxPrice') {
        price += formatPriceLocaleVi(value);
      }
      return value && !ignored.includes(key);
    });

    if (price) {
      dataFormat.push(['price', price]);
    }

    return dataFormat;
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

  const renderTag = (key: string, value: string) => {
    if (key === 'minPrice' || key === 'maxPrice') {
      return formatPriceLocaleVi(value);
    }
    return getViTag(value).toLowerCase();
  };

  return (
    <>
      <InputBase component='div' multiline radius={'lg'} w={'100%'} px={'xs'}>
        <Group gap={4}>
          <Text fw={700} size='sm'>
            Lọc:
          </Text>
          <Pill.Group>
            {activeFilters.map(([key, value]) => (
              <Pill key={key} withRemoveButton onRemove={() => removeFilter(key, value)} className='bg-mainColor/10'>
                {renderTag(key, value)}
              </Pill>
            ))}
          </Pill.Group>
          {activeFilters?.length > 1 && (
            <BButton children='Xóa tất cả' size='xs' onClick={() => router.push('/thuc-don')} radius={'xl'} />
          )}
        </Group>
      </InputBase>
    </>
  );
}
