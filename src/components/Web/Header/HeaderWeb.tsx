import { getServerSession } from 'next-auth';
import { authOptions } from '~/app/api/auth/[...nextauth]/options';
import BreadcrumbsComponent from '~/components/BreadcrumbsComponent';
import NotificationDialog from '~/components/NotificationDialog';
import { api } from '~/trpc/server';
import { Header1 } from './layout/header1';
import Header2 from './layout/header2';
import Header3 from './layout/header3';

const HeaderWeb = async () => {
  const user = await getServerSession(authOptions);
  const [restaurant, categories, subCategories, notifications] = await Promise.all([
    api.Restaurant.getOne(),
    api.Category.getAll(),
    api.SubCategory.getAll(),
    user?.user?.email ? api.Notification.getFilter({ s: user?.user?.email || '' }) : undefined
  ]);

  return (
    <>
      {user?.user?.email && <NotificationDialog data={notifications} user={user?.user} />}
      <Header1 restaurant={restaurant} />
      <Header2 subCategories={subCategories} />
      <Header3 categories={categories} subCategories={subCategories} />
      <BreadcrumbsComponent subCategories={subCategories} />
    </>
  );
};

export default HeaderWeb;
