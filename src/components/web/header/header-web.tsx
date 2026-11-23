import { BreadcrumbsComponent } from '~/components/breadcrumbs/breadcrumbs';
import { api, HydrateClient } from '~/trpc/server';
import Header2 from '~/components/web/header/sections/header-second';
import Header3 from '~/components/web/header/sections/header-third';

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
