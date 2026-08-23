import { BreadcrumbsComponent } from '~/components/Breadcrumbs/BreadcrumbsComponent';
import { api, HydrateClient } from '~/trpc/server';
import Header2 from './section/HeaderSecond';
import Header3 from './section/HeaderThird';

const HeaderWeb = async () => {
  await Promise.all([
    api.SubCategory.getSubCategoriesWithRelationBasic.prefetch(),
    api.Category.getCategoriesWithRelationBasic.prefetch()
  ]);
  return (
    <HydrateClient>
      <Header2 />
      <Header3 />
      <BreadcrumbsComponent />
    </HydrateClient>
  );
};

export default HeaderWeb;
