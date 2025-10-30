import { Metadata } from 'next';
import { api } from '~/trpc/server';
import SettingPageClient from './pageClient';
export const metadata: Metadata = {
  title: 'Quản lý cài đặt '
};
export default async function SettingPage() {
  const restaurant = await api.Restaurant.getOneActive();
  return <SettingPageClient initData={restaurant} />;
}
