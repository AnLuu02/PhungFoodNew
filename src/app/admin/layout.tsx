'use client';

import { AppShell, Box, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Header from '../_components/Admin/Header';
import Navbar from '../_components/Admin/Navbar';
import BreadcrumbsComponent from '../_components/Breadcrumbs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      padding='md'
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
        <Header />
      </AppShell.Header>

      <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar>

      <AppShell.Main w={'100%'} m={0}>
        <Box mb='md'>
          <BreadcrumbsComponent />
        </Box>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
