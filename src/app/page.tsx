import { Box, rem } from '@mantine/core';
import { api } from '~/trpc/server';
import HomeWeb from './_components/Web/Home/HomeWeb';

export const revalidate = 60;

const Page = async () => {
  const [anVat, monChinh, monChay, thucUong, productDiscount, productBestSaler, productNew, productHot]: any =
    await Promise.all([
      await api.SubCategory.find({
        skip: 0,
        take: 99,
        query: 'an-vat-trang-mieng'
      }),
      await api.SubCategory.find({
        skip: 0,
        take: 99,
        query: 'mon-chinh'
      }),
      await api.SubCategory.find({
        skip: 0,
        take: 99,
        query: 'mon-chay'
      }),
      await api.SubCategory.find({
        skip: 0,
        take: 99,
        query: 'do-uong'
      }),
      await api.Product.find({
        skip: 0,
        take: 99,
        discount: true
      }),
      await api.Product.find({
        skip: 0,
        take: 99,
        bestSaler: true
      }),
      await api.Product.find({
        skip: 0,
        take: 10,
        newProduct: true
      }),
      await api.Product.find({
        skip: 0,
        take: 10,
        hotProduct: true
      })
    ]);

  return (
    <Box className='w-full' pl={{ base: rem(20), lg: rem(130) }} pr={{ base: rem(20), lg: rem(130) }}>
      <HomeWeb
        data={{
          category: {
            anVat: anVat.subCategories || [],
            monChinh: monChinh.subCategories || [],
            monChay: monChay.subCategories || [],
            thucUong: thucUong.subCategories || []
          },
          productDiscount: productDiscount || [],
          productBestSaler: productBestSaler || [],
          productNew: productNew || [],
          productHot: productHot || []
        }}
      />
    </Box>
  );
};

export default Page;
