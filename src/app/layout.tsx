import '@mantine/carousel/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/spotlight/styles.css';
import '~/styles/globals.css';

import { Box, ColorSchemeScript, createTheme, MantineProvider, rem } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { type Metadata } from 'next';
import { getServerSession, Session } from 'next-auth';
import { Quicksand } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { TRPCReactProvider } from '~/trpc/react';
import ScrollToTop from './_components/ScrollToTop';
import { authOptions } from './api/auth/[...nextauth]/options';

import localFont from 'next/font/local';
import FloatingWidget from './_components/FloatingWidget/FloatingWidget';
import FooterWeb from './_components/Web/Footer/FooterWeb';
import HeaderWeb from './_components/Web/Header/HeaderWeb';
import ServiceComponent from './_components/Web/Home/_Components/ServiceComponent';
import { GlobalModal } from './contexts/GlobalModal';
import { ModalProvider } from './contexts/ModalContext';

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
  icons: [{ rel: 'icon', url: '/logo/bg.jpg' }]
};

const theme = createTheme({
  colors: {
    green: [
      '#f6ffed', // Nhẹ nhất
      '#d9f7be',
      '#b7eb8f',
      '#95de64',
      '#73d13d',
      '#52c41a',
      '#389e0d',
      '#237804',
      '#135200', // Đậm hơn
      '#008b4b' // Đậm nhất
    ],
    yellow: [
      '#fffbe6', // Nhẹ nhất
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
    // #ff0000 red
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
              <ModalProvider>
                <Box p={0} m={0}>
                  <HeaderWeb />
                  {children}
                  <Box pl={{ base: rem(20), lg: rem(130) }} pr={{ base: rem(20), lg: rem(130) }}>
                    <ServiceComponent />
                  </Box>
                  <FloatingWidget />
                  <FooterWeb />
                </Box>
                <GlobalModal />
              </ModalProvider>
            </ModalsProvider>
            <ScrollToTop />
          </MantineProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
