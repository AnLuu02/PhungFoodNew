'use client';
import { Box, Flex, rem } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { noHeadersLayoutCondition } from '~/app/lib/utils/constants/no-headers-layout-condition';
import BreadcrumbsComponent from '../../Breadcrumbs';
import NotificationDialog from '../../Notify-Admin/NotificationDialog';
import { BreadcrumbClient } from '../_components/BreadcrumbClient';
import { Header1 } from './layout/header1';
import Header2 from './layout/header2';
import Header3 from './layout/header3';

const HeaderLayout = ({ data }: { data: any }) => {
  const pathname = usePathname();
  const { data: user } = useSession();
  return noHeadersLayoutCondition.every(path => !pathname.includes(path)) ? (
    <>
      {user && (
        <Box pos={'fixed'} top={6} right={12} className='z-[9999] rounded-full' w={30} h={30} bg={'white'}>
          <NotificationDialog />
        </Box>
      )}
      <Header1 restaurant={data.restaurant} />
      <Header2 subCategories={data.subCategories} />
      <Header3 categories={data.categories} subCategories={data.subCategories} />
      {pathname !== '/' && pathname !== '/thuc-don' && (
        <Flex
          pl={{ base: rem(20), lg: rem(130) }}
          pr={{ base: rem(20), lg: rem(130) }}
          align={'center'}
          justify={'space-between'}
          py={'md'}
          bg={'gray.1'}
        >
          <BreadcrumbsComponent />
        </Flex>
      )}
      {pathname === '/thuc-don' && (
        <Flex align={'center'} justify={'space-between'}>
          <BreadcrumbClient />
        </Flex>
      )}
    </>
  ) : (
    ''
  );
};

export default HeaderLayout;
