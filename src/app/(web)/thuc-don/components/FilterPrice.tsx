import { Button, Divider, Flex, Grid, GridCol, NumberInput, Popover, RangeSlider, Text } from '@mantine/core';
import { IconMoneybag } from '@tabler/icons-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { formatPriceLocaleVi } from '~/lib/func-handler/formatPrice';

export default function FilterPriceMenu() {
  const [valuePrice, setValuePrice] = useState<number[]>([20000, 200000]);
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const handleApply = () => {
    const s = new URLSearchParams(params);
    if (valuePrice?.length > 0 && (valuePrice[0] !== 20000 || valuePrice[1] !== 200000)) {
      s.set('price', valuePrice?.join('-'));
    } else {
      s.delete('price');
    }
    router.push(`${pathname}?${s.toString()}`);
  };
  return (
    <Popover width={250} position='bottom' radius={'md'} arrowSize={10} withArrow shadow='lg'>
      <Popover.Target>
        <Button
          variant='subtle'
          className='border-1 border-mainColor text-mainColor'
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
              Khoảng giá
            </Text>
          </GridCol>
          <GridCol span={12} pt={0} mt={0}>
            <Flex align={'center'}>
              <Text size='lg' className='font-bold text-red-700'>
                {formatPriceLocaleVi(valuePrice[0] || 0)}
              </Text>
              <Divider orientation='horizontal' w={10} size={3} c={'red'} ml={10} mr={10} />
              <Text size='lg' className='font-bold text-red-700'>
                {formatPriceLocaleVi(valuePrice[1] || 0)}
              </Text>
            </Flex>
            <Text size='sm' c={'dimmed'}>
              Sản phẩm trong khoảng giá này
            </Text>
          </GridCol>

          <GridCol span={12}>
            <RangeSlider
              min={0}
              max={500000}
              step={20000}
              defaultValue={[20000, 200000]}
              value={valuePrice as [number, number]}
              onChange={setValuePrice}
              classNames={{
                root: 'mt-2',
                thumb: 'bg-mainColor',
                track: 'bg-mainColor',
                bar: 'bg-mainColor',
                label: 'bg-subColor font-bold text-black'
              }}
            />
          </GridCol>
          <GridCol span={12}>
            <Flex align={'center'} justify={'space-between'}>
              <NumberInput
                thousandSeparator=','
                clampBehavior='strict'
                defaultValue={valuePrice[0] || 0}
                value={valuePrice[0]}
                onChange={v => {
                  const value = Number(v) || 0;
                  if (value < 0) return;
                  if (valuePrice[1] && value > valuePrice[1]) {
                    setValuePrice([value, value]);
                  } else {
                    setValuePrice([value, valuePrice[1] || 0]);
                  }
                }}
                max={500000}
                min={0}
                w={'40%'}
              ></NumberInput>
              <Text>---</Text>
              <NumberInput
                thousandSeparator=','
                clampBehavior='strict'
                value={valuePrice[1]}
                onChange={v => {
                  const value = Number(v) || 0;
                  if (value < 0) return;
                  if (valuePrice[0] && valuePrice[0] > value) {
                    setValuePrice([value, value]);
                  } else {
                    setValuePrice([value, value]);
                  }
                }}
                defaultValue={valuePrice[1] || 0}
                max={500000}
                min={0}
                w={'40%'}
              ></NumberInput>
            </Flex>
          </GridCol>
          <GridCol span={12}>
            <Button
              radius={'xl'}
              size='sm'
              onClick={handleApply}
              fullWidth
              className='bg-mainColor text-white transition-all duration-200 ease-in-out hover:bg-subColor hover:text-black'
            >
              Áp dụng
            </Button>
          </GridCol>
        </Grid>
      </Popover.Dropdown>
    </Popover>
  );
}
