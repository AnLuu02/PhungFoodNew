import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Quản lý ảnh ',
    absolute: 'Quản lý ảnh',
    template: '%s | Quản lý ảnh'
  }
};
export default function ImageLayout({ children }: { children: React.ReactNode }) {
  return { children };
}
