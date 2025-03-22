'use client';
import { Box, Center, Flex, Group, Image, rem } from '@mantine/core';
import Link from 'next/link';
import SearchComponentClient from '~/app/_components/Search/SearchClient';
import CartButton from '../_components/gio-hang-button';
import PromotionButton from '../_components/khuyen-mai';
import LikeButton from '../_components/yeu-thich';

const Header2 = ({ subCategories }: { subCategories: any }) => {
  return (
    <>
      <Flex
        h={{ base: 'max-content', md: 92 }}
        bg={'gray.1'}
        pl={{ base: rem(20), lg: rem(130) }}
        pr={{ base: rem(20), lg: rem(130) }}
        justify={'space-between'}
        align={'center'}
        pos={'relative'}
        className='z-[101] text-white'
        direction={{ base: 'column', sm: 'row', md: 'row' }}
        py={{ base: 20, md: 0 }}
        gap={{ base: 'md', md: 0 }}
      >
        <Link href={'/'}>
          <Center>
            <Image loading='lazy' src='/logo/logo_phungfood_1.png' alt='logo' w={250} h={80} p={0} />
          </Center>
        </Link>
        <Box w={{ base: '100%', md: 400, lg: 550 }}>
          <SearchComponentClient subCategories={subCategories} />
        </Box>
        <Group>
          <Box className='hidden xl:block'>
            <PromotionButton />
          </Box>
          <LikeButton />
          <CartButton />
        </Group>
      </Flex>
    </>
  );
};

export default Header2;
