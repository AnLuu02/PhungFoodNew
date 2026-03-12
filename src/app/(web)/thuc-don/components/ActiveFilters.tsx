'use client';

import { Group, InputBase, Pill, Text } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import BButton from '~/components/Button/Button';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { getViTag } from '~/lib/FuncHandler/generateTag';
const IGNORED_PARAMS = ['page', 'limit', 'maxPrice', 'minPrice', 's'];
export default function ActiveFilters() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeFilters = useMemo(() => {
    let price = '';

    const dataFormat = Array.from(searchParams.entries()).filter(([key, value]) => {
      if (key === 'minPrice') {
        price += `Giá từ ${formatPriceLocaleVi(value)} - `;
      }

      if (key === 'maxPrice') {
        price += formatPriceLocaleVi(value);
      }

      return value && !IGNORED_PARAMS.includes(key);
    });

    if (price) {
      dataFormat.push(['price', price]);
    }

    return dataFormat;
  }, [searchParams]);
  const removeFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    const allValues = newParams.getAll(key);
    const updatedValues = allValues.filter(v => v !== value);
    if (key === 'price') {
      newParams.delete('minPrice');
      newParams.delete('maxPrice');
    } else {
      newParams.delete(key);
    }
    updatedValues.forEach(v => newParams.append(key, v));
    router.replace(`${window.location.pathname}?${newParams.toString()}`, { scroll: false });
  };

  const renderTag = (key: string, value: string) => {
    if (key === 'minPrice' || key === 'maxPrice') {
      return formatPriceLocaleVi(value);
    }
    return getViTag(value).toLowerCase();
  };
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return activeFilters.length === 0 ? null : (
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
            <BButton children='Xóa tất cả' size='xs' h={22} onClick={() => router.push('/thuc-don')} radius={'xl'} />
          )}
        </Group>
      </InputBase>
    </>
  );
}
