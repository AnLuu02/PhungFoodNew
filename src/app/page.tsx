import { Box, rem } from '@mantine/core';
import { api } from '~/trpc/server';
import HomeWeb from './_components/Web/Home/HomeWeb';

export const revalidate = 60;

const fetchData = async (promises: Promise<any>[]) => {
  try {
    return await Promise.all(promises);
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Failed to fetch data');
  }
};

const Page = async () => {
  try {
    const categories = ['an-vat-trang-mieng', 'mon-chinh', 'mon-chay', 'do-uong'];
    const productFilters = [
      { key: 'discount', value: true },
      { key: 'bestSaler', value: true },
      { key: 'newProduct', value: true },
      { key: 'hotProduct', value: true }
    ];
    const materials = ['thit-tuoi', 'hai-san', 'rau-cu', 'cac-loai-nam'];
    const categoryPromises = categories.map(category => api.SubCategory.find({ skip: 0, take: 10, s: category }));
    const productPromises = productFilters.map(filter =>
      api.Product.find({ skip: 0, take: 10, [filter.key]: filter.value })
    );
    const materialPromises = materials.map(material => api.Product.find({ skip: 0, take: 10, s: material }));
    const bannerPromise = api.Restaurant.getOneBanner({ isActive: true });
    const [banner, ...categoryResults] = await fetchData([
      bannerPromise,
      ...categoryPromises,
      ...productPromises,
      ...materialPromises
    ]);
    const [anVat, monChinh, monChay, thucUong] = categoryResults.slice(0, categories.length);
    const [productDiscount, productBestSaler, productNew, productHot] = categoryResults.slice(
      categories.length,
      categories.length + productFilters.length
    );
    const [thitTuoi, haiSan, rauCu, cacLoaiNam] = categoryResults.slice(categories.length + productFilters.length);
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
    console.error('Failed to load page data:', error);
    return <div>Đã xảy ra lỗi khi tải dữ liệu</div>;
  }
};
export default Page;
