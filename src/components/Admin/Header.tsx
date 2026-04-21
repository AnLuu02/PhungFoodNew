'use client';
import { Badge, Flex } from '@mantine/core';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import ButtonControlModeTheme from '../Button/ButtonControlModeTheme';
import { GlobalSearch } from '../Search/GlobalSearch';
import UserSection from '../UserSection';

export default function Header() {
  const { data: session } = useSession();
  return (
    <Flex
      justify='space-between'
      align={'center'}
      h='100%'
      flex={1}
      gap={'md'}
      direction={{ base: 'row', sm: 'row-reverse', md: 'row' }}
    >
      <Flex
        justify={'flex-end'}
        align='center'
        w={{ base: '100%', sm: 'max-content', md: 'max-content', lg: 'max-content' }}
      >
        <Link href={'/'}>
          <Image
            src='/logo/logo_phungfood_1.png'
            alt='logo'
            priority
            width={150}
            height={50}
            style={{ objectFit: 'cover' }}
          />
        </Link>
        <Badge bg={'red'} radius={'sm'} className='hidden lg:block'>
          {session?.user?.role || 'Admin'}
        </Badge>
      </Flex>

      <Flex align={'center'} gap={'md'} className='hidden lg:flex'>
        <GlobalSearch width={{ base: '100%', sm: 350, md: 300, lg: 400 }} />
        <ButtonControlModeTheme />
        <UserSection />
      </Flex>
    </Flex>
  );
}
