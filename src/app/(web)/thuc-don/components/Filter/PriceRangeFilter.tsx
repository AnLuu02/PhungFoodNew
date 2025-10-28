import { Box, Button, Divider, Flex, Grid, GridCol, NumberInput, Popover, RangeSlider, Text } from '@mantine/core';
import { IconMoneybag } from '@tabler/icons-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import BButton from '~/components/Button/Button';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';

export function PriceRangeFilter() {
  const [message, setMessage] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const onHandleFilter = () => {
    const params = new URLSearchParams(searchParams);

    if (maxPrice === 0) {
      setMessage('Giá tối đa không được bằng 0.');
      return;
    }

    if (minPrice > maxPrice) {
      setMessage('Giá tối thiểu không được lớn hơn giá tối đa.');
      return;
    }

    if (maxPrice < 10000) {
      setMessage('Giá phải từ 10.000 VNĐ trở lên.');
      return;
    }

    setMessage('');
    params.set('minPrice', String(minPrice));
    params.set('maxPrice', String(maxPrice));
    router.push(`${pathname}?${params.toString()}`);
  };
  return (
    <Popover width={300} position='bottom' radius={'md'} arrowSize={10} withArrow shadow='lg'>
      <Popover.Target>
        <Button
          variant='subtle'
          radius={'md'}
          className='border-1 border-mainColor text-mainColor hover:bg-mainColor/10 hover:text-mainColor'
          leftSection={<IconMoneybag size={16} />}
          w={'max-content'}
        >
          Giá
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Grid>
          <GridCol span={12}>
            <Text size='lg' className='font-bold'>
              Khoảng giá (từ <b className='text-subColor'>20k</b> đến <b className='text-subColor'>500k</b>)
            </Text>
          </GridCol>
          <GridCol span={12} pt={0} mt={0}>
            <Flex align={'center'}>
              <Text size='lg' className='font-bold text-mainColor'>
                {formatPriceLocaleVi(minPrice || 0)}
              </Text>
              <Divider orientation='horizontal' w={10} size={3} color={'green'} ml={10} mr={10} />
              <Text size='lg' className='font-bold text-mainColor'>
                {formatPriceLocaleVi(maxPrice || 0)}
              </Text>
            </Flex>
            <Text size='sm' c={'dimmed'}>
              Sản phẩm trong khoảng giá này
            </Text>
          </GridCol>

          <GridCol span={12}>
            <RangeSlider
              min={0}
              radius={'md'}
              max={500000}
              step={20000}
              label={value => formatPriceLocaleVi(value)}
              defaultValue={[20000, 200000]}
              value={[minPrice, maxPrice]}
              classNames={{
                thumb: 'text-mainColor'
              }}
              onChange={v => {
                setMinPrice(v[0]);
                setMaxPrice(v[1]);
              }}
            />
          </GridCol>
          <GridCol span={12}>
            <Flex align={'center'} justify={'space-between'} gap={'md'}>
              <NumberInput
                radius={'md'}
                thousandSeparator=','
                clampBehavior='strict'
                label='Giá từ'
                value={minPrice}
                onChange={v => {
                  const value = Number(v) || 0;
                  setMinPrice(value);
                }}
                max={500000}
                min={0}
                error={message !== ''}
              />
              <NumberInput
                label='Đến'
                radius={'md'}
                thousandSeparator=','
                clampBehavior='strict'
                value={maxPrice}
                onChange={v => {
                  const value = Number(v) || 0;
                  setMaxPrice(value);
                }}
                max={500000}
                min={0}
                error={message !== ''}
              />
            </Flex>
            <Box onClick={() => setMessage('')} className='animate-bounce cursor-pointer' mt={5}>
              {message !== '' && (
                <Text size='sm' c={'red'}>
                  {message}
                </Text>
              )}
            </Box>
          </GridCol>
          <GridCol span={12}>
            <BButton children={'Áp dụng'} onClick={onHandleFilter} fullWidth />
          </GridCol>
        </Grid>
      </Popover.Dropdown>
    </Popover>
  );
}
