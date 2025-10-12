import { Button, Checkbox, Grid, GridCol, Popover, Text } from '@mantine/core';
import { IconSort09 } from '@tabler/icons-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { dataSort } from '~/constants';

export function SortFilter() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const s = new URLSearchParams(params);
  const valueSort = params.getAll('sort') || [];

  return (
    <Popover width={250} position='bottom' radius={'md'} arrowSize={10} withArrow shadow='lg'>
      <Popover.Target>
        <Button
          variant='outline'
          className='border-1 border-mainColor text-mainColor hover:bg-mainColor/10 hover:text-mainColor'
          leftSection={<IconSort09 size={16} />}
          w={'max-content'}
        >
          Lọc theo
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
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
                      (category.tag === 'updatedAt-desc' && valueSort.includes('updatedAt-asc')) ||
                      (category.tag === 'best-seller' && valueSort.includes('updatedAt-asc')) ||
                      (category.tag === 'updatedAt-asc' && valueSort.includes('updatedAt-desc')) ||
                      (category.tag === 'best-seller' && valueSort.includes('updatedAt-desc')) ||
                      (category.tag === 'updatedAt-asc' && valueSort.includes('best-seller')) ||
                      (category.tag === 'updatedAt-desc' && valueSort.includes('best-seller'))
                    }
                    key={category.tag}
                    label={category.name}
                    value={category.tag}
                    onChange={event => {
                      if (event.target.checked) {
                        s.append('sort', category.tag);
                      } else {
                        s.delete('sort', category.tag);
                      }
                      router.push(`${pathname}?${s.toString()}`);
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
                s.delete('sort');
                router.push(`${pathname}?${s.toString()}`);
              }}
              color='red'
              className='bg-mainColor text-white transition-all duration-200 ease-in-out hover:bg-subColor hover:text-black'
            >
              Hủy lọc
            </Button>
          </GridCol>
        </Grid>
      </Popover.Dropdown>
    </Popover>
  );
}
