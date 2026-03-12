'use client';
import { Box, Flex, Grid, GridCol, Group, Skeleton, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { SearchInput } from '~/components/Search/SearchInput';
import { breakpoints } from '~/constants';
import tags from '~/constants/tags-vi';
import { getTagFromQuery } from '~/lib/FuncHandler/generateTag';
import ActiveFilters from './ActiveFilters';
import { PriceRangeFilter } from './Filter/PriceRangeFilter';
import { SortFilter } from './Filter/SortFilter';
import HeaderSearchResults from './HeaderSearchResults';

export default function HeaderMenu({ totalProducts, isLoading }: { totalProducts: number; isLoading: boolean }) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('s');
  const activeTag = useMemo(() => getTagFromQuery(searchParams, tags), [searchParams, tags]);
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.xs}px)`);
  return (
    <>
      <HeaderSearchResults s={searchQuery} totalProducts={totalProducts} isLoading={isLoading} />
      <Grid mb={{ base: 20, md: 30 }}>
        <GridCol span={12}>
          <Grid>
            <GridCol span={{ base: 12, lg: 5 }}>
              <Flex direction={'column'}>
                <>
                  <Text c={'dimmed'} size='sm'>
                    Danh mục
                  </Text>
                  {isLoading ? (
                    <Group gap='xs' align='center' mih={45}>
                      <Skeleton height={28} width='120px' radius='sm' />
                      <Skeleton height={24} width='40px' radius='sm' />
                    </Group>
                  ) : (
                    <Group gap={'xs'}>
                      <Title className='font-quicksand text-mainColor'>{activeTag}</Title>
                      <Title order={2} className='font-quicksand text-mainColor'>
                        ({totalProducts || 0})
                      </Title>
                    </Group>
                  )}
                </>
              </Flex>
            </GridCol>
            {!isMobile && (
              <GridCol span={{ base: 12, lg: 7 }} className='flex flex-wrap justify-end gap-2'>
                <PriceRangeFilter />
                <SortFilter />
                <Box flex={1}>
                  <SearchInput />
                </Box>
              </GridCol>
            )}
          </Grid>
        </GridCol>
        <ActiveFilters />
      </Grid>
    </>
  );
}
