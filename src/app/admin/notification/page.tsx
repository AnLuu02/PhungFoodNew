import { Card, Group, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import SearchQueryParams from '~/app/_components/Search/SearchQueryParams';
import { authOptions } from '~/app/api/auth/[...nextauth]/options';
import { api } from '~/trpc/server';
import { CreateNotificationButton } from './components/Button';
import TableNotification from './components/Table/TableNotification';
export const metadata: Metadata = {
  title: {
    default: 'Quản lý thông báo ',
    absolute: 'Quản lý thông báo',
    template: '%s | Quản lý thông báo'
  }
};
export default async function NotificationManagementPage({
  searchParams
}: {
  searchParams?: {
    s?: string;
    page?: string;
    limit?: string;
  };
}) {
  const s = searchParams?.s || '';
  const currentPage = searchParams?.page || '1';
  const limit = searchParams?.limit ?? '3';
  const totalData = await api.Notification.getAll();
  const user = await getServerSession(authOptions);
  const data = await api.Notification.find({ skip: +currentPage, take: +limit, s });

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder mt='md'>
      <Title mb='xs' className='font-quicksand'>
        Quản lý thông báo
      </Title>
      <Group justify='space-between' mb='md'>
        <Text fw={500} size='md'>
          Số lượng bản ghi: {totalData && totalData?.length}
        </Text>
        <Group>
          <SearchQueryParams />
          {(user?.user?.role === 'ADMIN' || user?.user?.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN) && (
            <>
              <CreateNotificationButton />
            </>
          )}
        </Group>
      </Group>

      <TableNotification data={data} s={s} user={user} />
    </Card>
  );
}
