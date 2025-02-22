import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Quản lý danh mục ',
    absolute: 'Quản lý danh mục',
    template: '%s | Quản lý danh mục'
  }
};
export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return { children };
}
