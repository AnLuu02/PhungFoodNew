import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Quản lý sản phẩm ',
    absolute: 'Quản lý sản phẩm',
    template: '%s | Quản lý sản phẩm'
  }
};
export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return { children };
}
