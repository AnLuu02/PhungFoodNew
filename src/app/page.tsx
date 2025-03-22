import { Box, rem } from '@mantine/core';
import { api } from '~/trpc/server';
import HomeWeb from './_components/Web/Home/HomeWeb';

export const revalidate = 60;

const Page = async () => {
  try {
    const categories = ['an-vat-trang-mieng', 'mon-chinh', 'mon-chay', 'do-uong'];
    const productFilters = [
      { key: 'discount', value: true },
      { key: 'bestSaler', value: true },
      { key: 'newProduct', value: true },
      { key: 'hotProduct', value: true }
    ];

    const categoryPromises = categories.map(s => api.SubCategory.find({ skip: 0, take: 10, s }));

    const productPromises = productFilters.map(filter =>
      api.Product.find({ skip: 0, take: 10, [filter.key]: filter.value })
    );

    const materials = ['thit-tuoi', 'hai-san', 'rau-cu', 'cac-loai-nam'];

    const materialPromises = materials.map(s => api.Product.find({ skip: 0, take: 10, s }));

    const bannerPromise = api.Restaurant.getOneBanner({ isActive: true });

    const [
      banner,
      anVat,
      monChinh,
      monChay,
      thucUong,
      productDiscount,
      productBestSaler,
      productNew,
      productHot,
      thitTuoi,
      haiSan,
      rauCu,
      cacLoaiNam
    ]: any = await Promise.all([bannerPromise, ...categoryPromises, ...productPromises, ...materialPromises]);

    return (
      <Box className='w-full' pl={{ base: rem(20), lg: rem(130) }} pr={{ base: rem(20), lg: rem(130) }}>
        <HomeWeb
          data={{
            banner: banner || {},
            category: {
              anVat: anVat?.subCategories || [],
              monChinh: monChinh?.subCategories || [],
              monChay: monChay?.subCategories || [],
              thucUong: thucUong?.subCategories || []
            },
            materials: {
              thitTuoi: thitTuoi || [],
              haiSan: haiSan || [],
              rauCu: rauCu || [],
              cacLoaiNam: cacLoaiNam || []
            },
            productDiscount: productDiscount || [],
            productBestSaler: productBestSaler || [],
            productNew: productNew || [],
            productHot: productHot || []
          }}
        />
      </Box>
    );
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return <div>Đã xảy ra lỗi khi tải dữ liệu</div>;
  }
};

export default Page;
