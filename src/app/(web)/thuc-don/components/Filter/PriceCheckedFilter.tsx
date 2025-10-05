'use client';
import { Button, CheckIcon, Flex, Radio, ScrollAreaAutosize, Stack, Text } from '@mantine/core';
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
        {params.get('price') && (
          <Button
            size='sm'
            fw={700}
            w={'max-content'}
            color='red'
            onClick={() => {
              const s = new URLSearchParams(params);
              s.delete('price');
              router.push(`${pathname}?${s.toString()}`);
            }}
            variant='subtle'
          >
            Xóa
          </Button>
        )}
      </Flex>
      <ScrollAreaAutosize mah={260} scrollbarSize={6} type='auto'>
        <Stack gap='xs'>
          {priceRanges.map(range => (
            <Radio
              icon={CheckIcon}
              checked={params.get('price') === range.value.toString()}
              key={range.value + range.label}
              value={range.value.toString()}
              onChange={e => {
                const s = new URLSearchParams(params);
                if (e.target.checked) {
                  s.set('price', e.target.value);
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
