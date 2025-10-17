import { getServerSession } from 'next-auth';
import { authOptions } from '~/app/api/auth/[...nextauth]/options';
import BreadcrumbsComponent from '~/components/BreadcrumbsComponent';
import NotificationDialog from '~/components/NotificationDialog';
import { api } from '~/trpc/server';
import { Header1 } from './section/HeaderFirst';
import Header2 from './section/HeaderSecond';
import Header3 from './section/HeaderThird';

const HeaderWeb = async ({ restaurant }: { restaurant: any }) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const [categories, subCategories, notifications] = await Promise.all([
    api.Category.getAll(),
    api.SubCategory.getAll(),
    user?.email ? api.Notification.getFilter({ s: user?.email || '' }) : undefined
  ]);

  return (
    <>
      {user?.email && <NotificationDialog data={notifications} user={user} />}
      <Header1 restaurant={restaurant} />
      <Header2 subCategories={subCategories} />
      <Header3 categories={categories} subCategories={subCategories} />
      <BreadcrumbsComponent subCategories={subCategories} />
    </>
  );
};

export default HeaderWeb;
