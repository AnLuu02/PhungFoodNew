import { api } from '~/trpc/server';
import ContentSidebarMenu from './ContentSidebarMenu';

export default async function SidebarMenu() {
  const [categories, materials] = await Promise.allSettled([api.Category.getAll(), api.Material.getAll()]);
  return (
    <ContentSidebarMenu
      materials={materials.status === 'fulfilled' ? materials.value : []}
      categories={categories.status === 'fulfilled' ? categories.value : []}
    />
  );
}
