'use client';
import { Box } from '@mantine/core';
import { useProductFilters } from '~/components/Hooks/use-product-filter';
import { api } from '~/trpc/react';
import HeaderMenu from './components/HeaderMenu';
import { MenuList } from './components/MenuList';

export default function MenuSection() {
  const filter = useProductFilters();
  const { data, isLoading } = api.Product.find.useQuery(filter);
  return (
    <Box pos={'relative'}>
      <HeaderMenu totalProducts={data?.pagination?.totalProducts || 0} isLoading={isLoading} />
      <MenuList responseData={data} isLoading={isLoading} />
    </Box>
  );
}
