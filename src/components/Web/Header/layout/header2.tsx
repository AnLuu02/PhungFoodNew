import { Box, Center, Flex, Group, rem } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import SearchComponentClient from '~/components/Search/SearchClient';
import CartButton from '../components/gio-hang-button';
import PromotionButton from '../components/khuyen-mai';
import LikeButton from '../components/yeu-thich';

const Header2 = ({ subCategories }: { subCategories: any }) => {
  const dataSubCategories = subCategories || [];
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
            <Image src='/logo/logo_phungfood_1.png' alt='logo' width={250} height={80} style={{ objectFit: 'cover' }} />
          </Center>
        </Link>
        <Box w={{ base: '100%', md: 400, lg: 550 }}>
          <SearchComponentClient subCategories={dataSubCategories} />
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
