import { Metadata } from 'next';
import { api } from '~/trpc/server';
import SettingPageClient from './pageClient';
export const metadata: Metadata = {
  title: 'Quản lý cài đặt '
};
export default async function SettingPage() {
  const [banner, restaurant] = await Promise.allSettled([api.Restaurant.getOneBanner({}), api.Restaurant.getOne()]);
  return (
    <SettingPageClient
      data={{
        banner: banner.status === 'fulfilled' ? banner.value : {},
        restaurant: restaurant.status === 'fulfilled' ? restaurant.value : {}
      }}
    />
  );
}
