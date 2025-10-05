'use client';
import { Box, Button, Flex, Grid, GridCol, Group, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconX } from '@tabler/icons-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SearchInput } from '~/components/Search/search-input';
import { breakpoints } from '~/constants';
import tags from '~/constants/tags-vi';
import { getTagFromQuery } from '~/lib/func-handler/generateTag';
import { PriceRangeFilter } from './Filter/PriceRangeFilter';
import { SortFilter } from './Filter/SortFilter';
import HeaderSearchResults from './HeaderSearchResults';

export default function HeaderMenu({ products }: { products: any[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.xs}px)`);

  return (
    <>
      {params.get('s') && <HeaderSearchResults products={products} />}
      <Grid mb={{ base: 20, md: 30 }}>
        <GridCol span={12}>
          <Grid>
            <GridCol span={{ base: 12, md: 5 }}>
              <Flex direction={'column'}>
                <>
                  <Text c={'dimmed'} size='sm'>
                    Danh mục
                  </Text>
                  <Group gap={'xs'}>
                    <Title className='font-quicksand text-mainColor'>{getTagFromQuery(params)}</Title>
                    <Title order={2} className='font-quicksand text-mainColor'>
                      ({products?.length})
                    </Title>
                  </Group>
                </>
              </Flex>
            </GridCol>
            {!isMobile && (
              <GridCol span={{ base: 12, md: 7 }} className='flex flex-wrap justify-end gap-2'>
                <PriceRangeFilter />
                <SortFilter />
                <Box w={{ base: '100%', md: '40%' }}>
                  <SearchInput />
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
                    styles={{
                      root: {
                        border: '1px solid'
                      }
                    }}
                    classNames={{
                      root: `!rounded-md !border-mainColor !font-bold text-mainColor hover:bg-mainColor/10 hover:text-mainColor data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-white`
                    }}
                    rightSection={
                      <IconX
                        size={16}
                        onClick={() => {
                          const s = new URLSearchParams(params);
                          s.delete('sort', tag);
                          s.delete('nguyen-lieu', tag);
                          router.push(`${pathname}?${s.toString()}`);
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
    </>
  );
}
