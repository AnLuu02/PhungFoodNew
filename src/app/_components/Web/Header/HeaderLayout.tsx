'use client';
import { Flex, rem } from '@mantine/core';
import { usePathname } from 'next/navigation';
import { noHeadersLayoutCondition } from '~/app/lib/utils/constants/no-headers-layout-condition';
import BreadcrumbsComponent from '../../Breadcrumbs';
import { BreadcrumbClient } from '../_components/BreadcrumbClient';
import { Header1 } from './layout/header1';
import Header2 from './layout/header2';
import Header3 from './layout/header3';

const HeaderLayout = ({ data }: { data: any }) => {
  const pathname = usePathname();
  return noHeadersLayoutCondition.every(path => !pathname.includes(path)) ? (
    <>
      <Header1 />
      <Header2 />
      <Header3 data={data.categories} />
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
