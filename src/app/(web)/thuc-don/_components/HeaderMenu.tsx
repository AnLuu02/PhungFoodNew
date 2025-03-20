import { Box, Button, Flex, Grid, GridCol, Group, Skeleton, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconX } from '@tabler/icons-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import SearchQueryParams from '~/app/_components/Search/SearchQueryParams';
import { breakpoints } from '~/app/lib/utils/constants/device';
import tags from '~/app/lib/utils/constants/tags-vi';
import { getTagFromQuery } from '~/app/lib/utils/func-handler/generateTag';
import FilterPriceMenu from './FilterPrice';
import FilterMenu from './FilterSort';

function HeaderMenu({ isLoading, products }: { isLoading: boolean; products: any[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.sm}px)`);

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
              <FilterMenu />
              <Box w={{ base: '100%', md: '40%' }}>
                <SearchQueryParams />
              </Box>
            </GridCol>
          )}
        </Grid>
      </GridCol>

      {(params.getAll('sort').length > 0 || params.getAll('nguyen-lieu').length > 0) && (
        <GridCol span={12}>
          <Flex align={'center'} justify={'flex-start'} gap={10}>
            {(params.getAll('sort')?.length > 0 ? params.getAll('sort') : params.getAll('nguyen-lieu')).map(
              (tag: string) => (
                <Button
                  key={tag}
                  variant='outline'
                  rightSection={
                    <IconX
                      size={16}
                      onClick={() => {
                        const query = new URLSearchParams(params);
                        query.delete('sort', tag);
                        query.delete('nguyen-lieu', tag);
                        router.push(`${pathname}?${query.toString()}`);
                      }}
                    />
                  }
                >
                  {tags[tag]}
                </Button>
              )
            )}
          </Flex>
        </GridCol>
      )}
    </Grid>
  );
}

export default HeaderMenu;
