'use client';
import { CheckIcon, Flex, Radio, ScrollAreaAutosize, Stack, Text } from '@mantine/core';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { priceRanges } from '~/constants';

export const PriceCheckedFilter = () => {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Stack gap='xs'>
      <Flex align={'center'} justify={'space-between'}>
        <Text size='md' fw={700}>
          CHỌN MỨC GIÁ
        </Text>
      </Flex>
      <ScrollAreaAutosize mah={260} scrollbarSize={6} type='auto'>
        <Stack gap='xs'>
          {priceRanges.map(range => (
            <Radio
              icon={CheckIcon}
              checked={
                params.get('minPrice') === range.minPrice.toString() &&
                params.get('maxPrice') === range.maxPrice.toString()
              }
              key={range.minPrice + range.label + range.maxPrice}
              value={range.maxPrice + 'to' + range.minPrice}
              onChange={e => {
                const s = new URLSearchParams(params);
                if (e.target.checked) {
                  s.set('minPrice', range.minPrice.toString());
                  s.set('maxPrice', range.maxPrice.toString());
                }
                router.push(`${pathname}?${s.toString()}`);
              }}
              name='range-price'
              label={range.label}
              classNames={{
                label: 'cursor-pointer font-medium hover:text-mainColor',
                radio:
                  'cursor-pointer text-mainColor data-[checked=true]:border-mainColor data-[checked=true]:bg-mainColor'
              }}
            />
          ))}
        </Stack>
      </ScrollAreaAutosize>
    </Stack>
  );
};
