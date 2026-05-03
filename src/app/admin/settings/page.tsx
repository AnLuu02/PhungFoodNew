import { Metadata } from 'next';
import { api, HydrateClient } from '~/trpc/server';
import SettingPageClient from './pageClient';
export const metadata: Metadata = {
  title: 'Quản lý cài đặt '
};
export default async function SettingPage() {
  await api.Restaurant.getOneActive.prefetch();
  return (
    <HydrateClient>
      <SettingPageClient />
    </HydrateClient>
  );
}
