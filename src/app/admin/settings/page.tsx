import { Metadata } from 'next';
import { api, HydrateClient } from '~/trpc/server';
import SettingPageClient from '~/app/admin/settings/page-client';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Quản lý cài đặt '
};
export default async function SettingPage() {
  await api.Restaurant.getBaseActiveAdmin.prefetch();
  return (
    <HydrateClient>
      <SettingPageClient />
    </HydrateClient>
  );
}
