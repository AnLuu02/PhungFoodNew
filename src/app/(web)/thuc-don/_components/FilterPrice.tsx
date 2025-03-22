import { Button, Divider, Flex, Grid, GridCol, NumberInput, Popover, RangeSlider, Text } from '@mantine/core';
import { IconMoneybag } from '@tabler/icons-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { formatPriceLocaleVi } from '~/app/lib/utils/func-handler/formatPrice';

function FilterPriceMenu() {
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
          c='green.9'
          className='border-1 border-[#008b4b]'
          leftSection={<IconMoneybag size={16} />}
          w={'max-content'}
        >
          Giá
        </Button>
      </Popover.Target>
      <Popover.Dropdown bg='var(--mantine-color-body)'>
        <Grid>
          <GridCol span={12}>
            <Text size='lg' className='font-bold'>
              Khoảng giá
            </Text>
          </GridCol>
          <GridCol span={12} pt={0} mt={0}>
            <Flex align={'center'}>
              <Text size='lg' c={'red.7'} className='font-bold'>
                {formatPriceLocaleVi(valuePrice[0] || 0)}
              </Text>
              <Divider orientation='horizontal' w={10} size={3} color={'red'} ml={10} mr={10} />
              <Text size='lg' c={'red.7'} className='font-bold'>
                {formatPriceLocaleVi(valuePrice[1] || 0)}
              </Text>
            </Flex>
            <Text size='sm' c={'dimmed'}>
              Sản phẩm trong khoảng giá này
            </Text>
          </GridCol>

          <GridCol span={12}>
            <RangeSlider
              color='green.9'
              min={0}
              max={500000}
              step={20000}
              defaultValue={[20000, 200000]}
              value={valuePrice as [number, number]}
              onChange={setValuePrice}
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
              className='bg-[#008b4b] text-white transition-all duration-200 ease-in-out hover:bg-[#f8c144] hover:text-black'
            >
              Áp dụng
            </Button>
          </GridCol>
        </Grid>
      </Popover.Dropdown>
    </Popover>
  );
}

export default FilterPriceMenu;
