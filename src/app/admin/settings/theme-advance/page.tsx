import { Metadata } from 'next';
import ThemeManagementAdvance from '~/app/admin/settings/theme-advance/components/theme-restaurant-advance';
export const metadata: Metadata = {
  title: 'Tùy chỉnh nâng cap'
};

export default async function ThemeAdvancePage() {
  return <ThemeManagementAdvance />;
}
