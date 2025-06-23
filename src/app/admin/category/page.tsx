import { Card, Group, Text, Title } from '@mantine/core';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import dynamic from 'next/dynamic';
import SearchQueryParams from '~/app/_components/Search/SearchQueryParams';
import { authOptions } from '~/app/api/auth/[...nextauth]/options';
import { api } from '~/trpc/server';
import { CreateCategoryButton, CreateManyCategoryButton } from './components/Button';
export const metadata: Metadata = {
  title: {
    default: 'Quản lý danh mục ',
    absolute: 'Quản lý danh mục',
    template: '%s | Quản lý danh mục'
  }
};
const TableCategory = dynamic(() => import('./components/Table/TableCategory'), { ssr: false });

export default async function CategoryManagementPage({
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
  const user = await getServerSession(authOptions);
  const data = await api.Category.find({ skip: +currentPage, take: +limit, s });

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder mt='md'>
      <Title mb='xs' className='font-quicksand'>
        Quản lý danh mục
      </Title>
      <Group justify='space-between' mb='md'>
        <Text fw={500} size='md'></Text>
        <Group>
          <SearchQueryParams />
          {(user?.user?.role === 'ADMIN' || user?.user?.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN) && (
            <>
              <CreateCategoryButton />
              <CreateManyCategoryButton />
            </>
          )}
        </Group>
      </Group>

      <TableCategory data={data} s={s} user={user} />
    </Card>
  );
}
