'use client';
import { Box } from '@mantine/core';
import { useEffect } from 'react';
import { useProductFilters } from '~/components/hooks/use-product-filter';
import { FindProduct } from '~/shared/types/trpc/product.types';
import { api } from '~/trpc/react';
import HeaderMenu from './components/HeaderMenu';
import { MenuList } from './components/MenuList';

export default function MenuSection() {
  const filter = useProductFilters();
  const { data, isLoading } = api.Product.find.useQuery(filter);

  const utils = api.useUtils();
  useEffect(() => {
    if (data?.pagination.hasNext) {
      void utils.Product.find.prefetch({ ...filter, page: Number(filter?.page || 1) + 1 });
    }
  }, [filter.page]);

  return (
    <Box pos={'relative'}>
      <HeaderMenu totalProducts={data?.pagination?.totalProducts || 0} isLoading={isLoading} />
      <MenuList responseData={data as FindProduct} isLoading={isLoading} />
    </Box>
  );
}
