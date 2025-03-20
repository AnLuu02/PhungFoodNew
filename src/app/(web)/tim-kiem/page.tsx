import { Container } from '@mantine/core';
import { api } from '~/trpc/server';
import HeaderSearchResults from './_components/Header';
import MainSearchResults from './_components/Main';

export default async function SearchResults({ searchParams }: { searchParams: { s: string } }) {
  const data = await api.Product.find({ skip: 0, take: 300, query: searchParams.s || '' });
  const products = data?.products || [];

  return (
    <Container size='xl' py='md'>
      <HeaderSearchResults products={products} />
      <MainSearchResults products={products} />
    </Container>
  );
}
