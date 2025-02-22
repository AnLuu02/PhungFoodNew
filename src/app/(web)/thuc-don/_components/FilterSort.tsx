import { Button, Checkbox, Grid, GridCol, Popover, Text } from '@mantine/core';
import { IconSort09 } from '@tabler/icons-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export const dataSort = [
  {
    name: 'Giá từ thấp đến cao',
    tag: 'price-asc'
  },
  {
    name: 'Giá từ cao đến thấp',
    tag: 'price-desc'
  },
  {
    name: 'Tên A-Z',
    tag: 'name-asc'
  },
  {
    name: 'Tên Z-A',
    tag: 'name-desc'
  },

  {
    name: 'Mới nhất',
    tag: 'new'
  },
  {
    name: 'Cũ nhất',
    tag: 'old'
  },
  {
    name: 'Bán chạy',
    tag: 'best-seller'
  }
];

function FilterMenu({ valueSort, setValueSort }: { valueSort: string[]; setValueSort: (value: string[]) => void }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const query = new URLSearchParams(params);
    if (valueSort?.length > 0) {
      const priceQuery = valueSort.find(item => item === 'price-asc' || item === 'price-desc');
      const nameQuery = valueSort.find(item => item === 'name-asc' || item === 'name-desc');

      if (priceQuery) {
        query.set('sort-price', priceQuery as string);
      }
      if (nameQuery) {
        query.set('sort-name', nameQuery as string);
      }
    } else {
      query.delete('sort-price');
      query.delete('sort-name');
    }
    router.push(`${pathname}?${query.toString()}`);
  }, [valueSort]);

  return (
    <Popover width={250} position='bottom' radius={'md'} arrowSize={10} withArrow shadow='lg'>
      <Popover.Target>
        <Button
          variant='outline'
          c='green.9'
          className='border-1 border-[#008b4b]'
          leftSection={<IconSort09 size={16} />}
          w={'max-content'}
        >
          Lọc theo
        </Button>
      </Popover.Target>
      <Popover.Dropdown bg='var(--mantine-color-body)'>
        <Grid>
          <GridCol span={12}>
            <Text size='lg' className='font-bold'>
              Lọc theo
            </Text>
          </GridCol>

          <GridCol span={12}>
            <Grid>
              {dataSort.map(category => (
                <GridCol span={12} key={category.tag}>
                  <Checkbox
                    checked={valueSort?.includes(category.tag)}
                    disabled={
                      (category.tag === 'price-asc' && valueSort.includes('price-desc')) ||
                      (category.tag === 'price-desc' && valueSort.includes('price-asc')) ||
                      (category.tag === 'name-asc' && valueSort.includes('name-desc')) ||
                      (category.tag === 'name-desc' && valueSort.includes('name-asc')) ||
                      (category.tag === 'new' && valueSort.includes('old')) ||
                      (category.tag === 'old' && valueSort.includes('new'))
                    }
                    key={category.tag}
                    label={category.name}
                    onChange={event => {
                      if (event.target.checked) {
                        setValueSort([...valueSort, category.tag]);
                      } else {
                        setValueSort(valueSort?.filter(tag => tag !== category.tag));
                      }
                    }}
                  />
                </GridCol>
              ))}
            </Grid>
          </GridCol>

          <GridCol span={12}>
            <Button
              radius={'xl'}
              size='sm'
              fullWidth
              onClick={() => {
                setValueSort([]);
              }}
              color='red'
              className='bg-[#008b4b] text-white transition-all duration-200 ease-in-out hover:bg-[#f8c144] hover:text-black'
            >
              Hủy lọc
            </Button>
          </GridCol>
        </Grid>
      </Popover.Dropdown>
    </Popover>
  );
}

export default FilterMenu;
