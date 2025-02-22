import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Quản lý danh mục con ',
    absolute: 'Quản lý danh mục con',
    template: '%s | Quản lý danh mục con'
  }
};
export default function SubCategorLayout({ children }: { children: React.ReactNode }) {
  return { children };
}
