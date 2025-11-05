import BreadcrumbsComponent from '~/components/BreadcrumbsComponent';
import { withRedisCache } from '~/lib/CacheConfig/withRedisCache';
import { api } from '~/trpc/server';
import Header2 from './section/HeaderSecond';
import Header3 from './section/HeaderThird';
const getStaticData = async () => {
  return await withRedisCache(
    'header-web-static',
    async () => {
      const [categories, subCategories] = await Promise.all([api.Category.getAll(), api.SubCategory.getAll()]);
      return [categories, subCategories];
    },
    60 * 60 * 24
  );
};
const HeaderWeb = async () => {
  const [categories, subCategories] = await getStaticData();
  return (
    <>
      <Header2 subCategories={subCategories} />
      <Header3 categories={categories} subCategories={subCategories} />
      <BreadcrumbsComponent subCategories={subCategories} />
    </>
  );
};

export default HeaderWeb;
