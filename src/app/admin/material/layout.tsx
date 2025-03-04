import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Quản lý nguyên liệu ',
    absolute: 'Quản lý nguyên liệu',
    template: '%s | Quản lý nguyên liệu'
  }
};
export default function MaterialLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
