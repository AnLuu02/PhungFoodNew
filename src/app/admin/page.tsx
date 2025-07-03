import { Stack } from '@mantine/core';
import dynamic from 'next/dynamic';
import CustomerReviews from '~/components/Admin/Dashboard/CustomerReviews';
import PopularItems from '~/components/Admin/Dashboard/PopularItems';
import RecentOrders from '~/components/Admin/Dashboard/RecentOrders';
import ThongKeNhanh from '~/components/Admin/Dashboard/ThongKeNhanh';
import { api } from '~/trpc/server';

const SalesChart = dynamic(() => import('~/components/Admin/Dashboard/SalesChart'), {
  ssr: false
});

export default async function Dashboard() {
  const [category, payment, users, orders, materials, products, vouchers, reviews, subCategories, images, roles] =
    await api.Layout.getDataAdminDashboard({});

  const averageRating =
    reviews?.length > 0 ? reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / reviews.length : 0;

  const highRatingPercentage =
    reviews?.length > 0 ? (reviews.filter((review: any) => review.rating >= 4).length / reviews.length) * 100 : 0;

  return (
    <div className='min-h-screen bg-gray-50 p-4'>
      <Stack gap='lg' className='mx-auto max-w-7xl'>
        <ThongKeNhanh
          data={{
            category,
            payment,
            users,
            orders,
            materials,
            products,
            vouchers,
            reviews,
            subCategories,
            images,
            roles
          }}
        />

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <div className='lg:col-span-2'>
            <SalesChart />
          </div>
          <div className='lg:col-span-1'>
            <CustomerReviews rating={highRatingPercentage} totalReviews={reviews?.length || 0} />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
          <RecentOrders orders={orders} />
          <PopularItems products={products} />
        </div>
      </Stack>
    </div>
  );
}
