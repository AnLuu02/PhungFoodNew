import { db } from '~/server/db';

export const generateStaticParams = async () => {
  const products = await db.product.findMany({
    select: {
      tag: true
    },
    take: 100
  });

  return products.map(product => ({
    slug: product.tag
  }));
};
