import { Metadata } from 'next';
import ThemeManagementAdvance from './components/theme-restautant-advance';
export const metadata: Metadata = {
  title: 'Tùy chỉnh nâng cap'
};

export default async function ThemeAdvancePage() {
  return <ThemeManagementAdvance />;
}
