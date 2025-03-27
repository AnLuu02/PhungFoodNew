'use client';

import { AppShell, Box, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Header from '../_components/Admin/Header';
import Navbar from '../_components/Admin/Navbar';
import BreadcrumbsComponent from '../_components/Breadcrumbs';

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'md',
        collapsed: { mobile: !opened }
      }}
      padding='md'
    >
      <AppShell.Header className='flex items-center justify-between' px={'sm'} w={'100%'}>
        <Burger
          opened={opened}
          fw={700}
          onClick={toggle}
          hiddenFrom='md'
          size='md'
          w={{ base: '20%', sm: '20%', md: 'max-content', lg: 'max-content' }}
        />
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
