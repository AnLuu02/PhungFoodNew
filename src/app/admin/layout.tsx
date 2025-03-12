import LayoutAdmin from './LayoutAdmin';

export const metadata = {
  title: 'Admin Dashboard'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <LayoutAdmin children={children} />;
}
