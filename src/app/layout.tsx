import '@mantine/carousel/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';
import 'tiptap-extension-resizable-image/styles.css';
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
    default: 'Phụng Food Restaurant',
    template: '%s | Phụng Food Restaurant'
  },
  description: 'Phụng Food Restaurant chuyên món ăn miền Tây – giao hàng tận nơi tại Cà Mau.',
  keywords: ['Phụng Food', 'đặc sản miền Tây', 'nhà hàng Cà Mau', 'ẩm thực Long An', 'đặt món online'],
  openGraph: {
    title: 'Phụng Food Restaurant',
    description: 'Đặc sản miền Tây – Nhà hàng tại Cà Mau, giao hàng nhanh.',
    url: 'https://phung-food-new.vercel.app',
    siteName: 'Phụng Food',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/logo/logo_phungfood_1.png',
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
  const [session, theme] = await Promise.all([getServerSession(authOptions), api.Restaurant.getTheme()]);
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
        <link rel='apple-touch-icon' sizes='57x57' href='/favicon/apple-icon-57x57.png' />
        <link rel='apple-touch-icon' sizes='60x60' href='/favicon/apple-icon-60x60.png' />
        <link rel='apple-touch-icon' sizes='72x72' href='/favicon/apple-icon-72x72.png' />
        <link rel='apple-touch-icon' sizes='76x76' href='/favicon/apple-icon-76x76.png' />
        <link rel='apple-touch-icon' sizes='114x114' href='/favicon/apple-icon-114x114.png' />
        <link rel='apple-touch-icon' sizes='120x120' href='/favicon/apple-icon-120x120.png' />
        <link rel='apple-touch-icon' sizes='144x144' href='/favicon/apple-icon-144x144.png' />
        <link rel='apple-touch-icon' sizes='152x152' href='/favicon/apple-icon-152x152.png' />
        <link rel='apple-touch-icon' sizes='180x180' href='/favicon/apple-icon-180x180.png' />
        <link rel='icon' type='image/png' sizes='192x192' href='/favicon/android-icon-192x192.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='96x96' href='/favicon/favicon-96x96.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon/favicon-16x16.png' />
        <link rel='manifest' href='/favicon/manifest.json' />
        <meta name='msapplication-TileColor' content='#ffffff' />
        <meta name='msapplication-TileImage' content='/ms-icon-144x144.png' />
        <meta name='theme-color' content='#ffffff' />
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
