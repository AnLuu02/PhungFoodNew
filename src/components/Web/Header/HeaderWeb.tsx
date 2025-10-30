import { getServerSession } from 'next-auth';
import { authOptions } from '~/app/api/auth/[...nextauth]/options';
import BreadcrumbsComponent from '~/components/BreadcrumbsComponent';
import NotificationDialog from '~/components/NotificationDialog';
import { withRedisCache } from '~/lib/CacheConfig/withRedisCache';
import { api } from '~/trpc/server';
import { Header1 } from './section/HeaderFirst';
import Header2 from './section/HeaderSecond';
import Header3 from './section/HeaderThird';

const getInit = async (user: any) => {
  return await withRedisCache(
    'header-web',
    async () => {
      const [categories, subCategories, notifications] = await Promise.all([
        api.Category.getAll(),
        api.SubCategory.getAll(),
        user?.id ? api.Notification.getFilter({ s: user?.id || '' }) : undefined
      ]);
      return [categories, subCategories, notifications];
    },
    60 * 60 * 24
  );
};
const HeaderWeb = async ({ restaurant }: { restaurant: any }) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const [categories, subCategories, notifications] = await getInit(user);

  return (
    <>
      {user?.id && <NotificationDialog data={notifications} userId={user?.id} />}
      <Header1 restaurant={restaurant} />
      <Header2 subCategories={subCategories} />
      <Header3 categories={categories} subCategories={subCategories} />
      <BreadcrumbsComponent subCategories={subCategories} />
    </>
  );
};

export default HeaderWeb;
