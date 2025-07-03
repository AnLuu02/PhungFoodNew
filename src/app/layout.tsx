import '@mantine/carousel/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '~/styles/globals.css';

import { ColorSchemeScript, createTheme, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { type Metadata } from 'next';
import { getServerSession, Session } from 'next-auth';
import { Quicksand } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { TRPCReactProvider } from '~/trpc/react';

import localFont from 'next/font/local';
import ScrollToTop from '~/components/ScrollToTop';
import { ModalProvider } from '~/contexts/ModalContext';
import { authOptions } from './api/auth/[...nextauth]/options';

const font = localFont({
  src: './fonts/my-font-mergeblack.ttf',
  variable: '--font-merge-black'
});
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
  description: 'Phụng Food Restaurant',
  icons: [{ rel: 'icon', url: '/logo/logo_phungfood_1.png' }]
};

const theme = createTheme({
  colors: {
    green: [
      '#f6ffed',
      '#d9f7be',
      '#b7eb8f',
      '#95de64',
      '#73d13d',
      '#52c41a',
      '#389e0d',
      '#237804',
      '#135200',
      '#008b4b'
    ],
    yellow: [
      '#fffbe6',
      '#fff1b8',
      '#ffe58f',
      '#ffd666',
      '#ffc53d',
      '#faad14',
      '#d48806',
      '#ad6800',
      '#f8c144',
      '#FFC522'
    ]
  }
});
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang='en'>
      <head>
        <ColorSchemeScript defaultColorScheme='light' />
      </head>
      <body className={`${quickSandFont.className} ${font.variable}`}>
        <TRPCReactProvider session={session as Session}>
          <MantineProvider theme={theme} defaultColorScheme='light'>
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
