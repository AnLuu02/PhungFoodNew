import { Box } from '@mantine/core';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Quản lý người dùng ',
    absolute: 'Quản lý người dùng',
    template: '%s | Quản lý người dùng'
  }
};
export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <Box>{children}</Box>;
}
