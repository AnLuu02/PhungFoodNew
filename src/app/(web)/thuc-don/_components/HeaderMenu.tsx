import { Box, Button, Flex, Grid, GridCol, Skeleton, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconX } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { breakpoints } from '~/app/lib/utils/constants/device';
import { getTagFromQuery } from '~/app/lib/utils/func-handler/generateTag';
import FilterPriceMenu from './FilterPrice';
import FilterMenu, { dataSort } from './FilterSort';
import GlobalSearchMenu from './GlobalSearchMenu';

function HeaderMenu({ isLoading, category }: { isLoading: boolean; category: any }) {
  const params = useSearchParams();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.mobile}px)`);
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
                  <Title className='font-quicksand' c={'green.9'}>
                    {getTagFromQuery(params)}
                  </Title>
                </>
              )}
            </Flex>
          </GridCol>
          {!isMobile && (
            <GridCol span={{ base: 12, md: 7 }} className='flex flex-wrap justify-end gap-2'>
              <FilterPriceMenu />
              <FilterMenu valueSort={valueSort} setValueSort={setValueSort} />
              <Box w={{ base: '100%', md: '40%' }}>
                <GlobalSearchMenu />
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
