import { Metadata } from 'next';
import { api } from '~/trpc/server';
import SettingPageClient from './pageClient';
export const metadata: Metadata = {
  title: 'Quản lý cài đặt '
};
export default async function SettingPage() {
  void api.Restaurant.getOneActive.prefetch();
  return <SettingPageClient />;
}
