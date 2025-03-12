import { Box, Button, Flex, Grid, GridCol, Group, Skeleton, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconX } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Search from '~/app/_components/Admin/Search';
import { breakpoints } from '~/app/lib/utils/constants/device';
import { getTagFromQuery } from '~/app/lib/utils/func-handler/generateTag';
import FilterPriceMenu from './FilterPrice';
import FilterMenu, { dataSort } from './FilterSort';

function HeaderMenu({ isLoading, category, products }: { isLoading: boolean; category: any; products: any[] }) {
  const params = useSearchParams();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.sm}px)`);
  const [valueSort, setValueSort] = useState<any[]>(
    params
      .getAll('sort')
      .join(',')
      .split(',')
      .filter(i => i != '')
  );

  return (
    <Grid mb={{ base: 20, md: 30 }}>
      <GridCol span={12}>
        <Grid>
          <GridCol span={{ base: 12, md: 5 }}>
            <Flex direction={'column'}>
              {isLoading ? (
                <Skeleton height={40} radius={'md'} />
              ) : (
                <>
                  <Text c={'dimmed'} size='sm'>
                    Danh mục
                  </Text>
                  <Group gap={'xs'}>
                    <Title className='font-quicksand' c={'green.9'}>
                      {getTagFromQuery(params)}
                    </Title>
                    <Title order={2} className='font-quicksand' c={'green.9'}>
                      ({products?.length})
                    </Title>
                  </Group>
                </>
              )}
            </Flex>
          </GridCol>
          {!isMobile && (
            <GridCol span={{ base: 12, md: 7 }} className='flex flex-wrap justify-end gap-2'>
              <FilterPriceMenu />
              <FilterMenu valueSort={valueSort} setValueSort={setValueSort} />
              <Box w={{ base: '100%', md: '40%' }}>
                {/* <GlobalSearchMenu /> */}
                <Search />
              </Box>
            </GridCol>
          )}
        </Grid>
      </GridCol>

      {valueSort.length > 0 && (
        <GridCol span={12}>
          <Flex align={'center'} justify={'flex-start'} gap={10}>
            {valueSort.map((tag: string) => (
              <Button
                key={tag}
                variant='outline'
                rightSection={<IconX size={16} onClick={() => setValueSort(valueSort.filter(i => i !== tag))} />}
              >
                {dataSort.find(i => i.tag === tag)?.name}
              </Button>
            ))}
          </Flex>
        </GridCol>
      )}
    </Grid>
  );
}

export default HeaderMenu;
