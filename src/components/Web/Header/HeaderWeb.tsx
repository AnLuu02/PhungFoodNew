import { BreadcrumbsComponent } from '~/components/Breadcrumbs/BreadcrumbsComponent';
import { withRedisCache } from '~/lib/CacheConfig/withRedisCache';
import { GetAllCategory } from '~/shared/type-trpc/category.type-trpc';
import { GetAllSubCategory } from '~/shared/type-trpc/subCategory.type-trpc';
import { api } from '~/trpc/server';
import Header2 from './section/HeaderSecond';
import Header3 from './section/HeaderThird';
const getStaticData = async () => {
  return await withRedisCache(
    'page:headerWebStatic',
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
      <Header2 subCategories={subCategories as GetAllSubCategory} />
      <Header3 categories={categories as GetAllCategory} subCategories={subCategories as GetAllSubCategory} />
      <BreadcrumbsComponent subCategories={subCategories as GetAllSubCategory} />
    </>
  );
};

export default HeaderWeb;
