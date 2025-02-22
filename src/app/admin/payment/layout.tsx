import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Quản lý thanh toán ',
    absolute: 'Quản lý thanh toán',
    template: '%s | Quản lý thanh toán'
  }
};
export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return { children };
}
