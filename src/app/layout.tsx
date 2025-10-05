import '@mantine/carousel/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';

import '~/styles/globals.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { type Metadata } from 'next';
import { getServerSession, Session } from 'next-auth';
import { Quicksand } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { TRPCReactProvider } from '~/trpc/react';

import ScrollToTop from '~/components/ScrollToTop';
import { ModalProvider } from '~/contexts/ModalContext';
import { hexToRgb } from '~/lib/func-handler/hexToRgb';
import { api } from '~/trpc/server';
import { authOptions } from './api/auth/[...nextauth]/options';

const quickSandFont = Quicksand({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-quicksand'
});

export const metadata: Metadata = {
  title: {
    default: 'Trang chủ | Phụng Food Restaurant',
    template: '%s | Phụng Food Restaurant'
  },
  description: 'Phụng Food Restaurant chuyên món ăn miền Tây – giao hàng tận nơi tại Cà Mau.',
  keywords: ['Phụng Food', 'đặc sản miền Tây', 'nhà hàng Cà Mau', 'ẩm thực Long An', 'đặt món online'],
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
  openGraph: {
    title: 'Phụng Food Restaurant',
    description: 'Đặc sản miền Tây – Nhà hàng tại Cà Mau, giao hàng nhanh.',
    url: 'https://phung-food-new.vercel.app',
    siteName: 'Phụng Food',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/images/logo/logo_phungfood_1.png',
        width: 1200,
        height: 630,
        alt: 'Phụng Food Restaurant'
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  },
  metadataBase: new URL('https://phung-food-new.vercel.app')
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);
  const theme = await api.Restaurant.getTheme();
  const defaultScheme =
    theme?.themeMode === 'dark' || theme?.themeMode === 'light' || theme?.themeMode === 'auto'
      ? theme.themeMode
      : 'light';
  const mainColor = theme?.primaryColor || '#00BFA6';
  const subColor = theme?.secondaryColor || '#f8c144';

  return (
    <html
      lang='en'
      style={{
        ['--color-mainColor' as any]: hexToRgb(mainColor),
        ['--color-subColor' as any]: hexToRgb(subColor)
      }}
    >
      <head>
        <ColorSchemeScript defaultColorScheme={defaultScheme} />
        <link rel='icon' href='/favicon.ico' />
      </head>
      <body className={`${quickSandFont.className}`}>
        <TRPCReactProvider session={session as Session}>
          <MantineProvider defaultColorScheme={defaultScheme}>
            <Notifications />
            <NextTopLoader />
            <ModalsProvider>
              <ModalProvider>{children}</ModalProvider>
            </ModalsProvider>
            <ScrollToTop />
          </MantineProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
