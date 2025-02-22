import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Quản lý hóa đơn ',
    absolute: 'Quản lý hóa đơn',
    template: '%s | Quản lý hóa đơn'
  }
};
export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return { children };
}
