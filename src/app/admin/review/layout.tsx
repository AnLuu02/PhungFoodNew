import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Quản lý đánh giá ',
    absolute: 'Quản lý đánh giá',
    template: '%s | Quản lý đánh giá'
  }
};
export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return <div className=''>{children}</div>;
}
