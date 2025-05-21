import { api } from '~/trpc/server';

export const generateStaticParams = async () => {
  const data = await api.Product.find({
    skip: 0,
    take: 100
  });
  const products = data.products || [];

  return products.map((product: { tag: string }) => ({
    slug: product.tag.toString()
  }));
};
