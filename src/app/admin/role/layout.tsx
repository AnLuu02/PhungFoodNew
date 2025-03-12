import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Quản lý quyền ',
    absolute: 'Quản lý quyền',
    template: '%s | Quản lý quyền'
  }
};
export default function RoleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
