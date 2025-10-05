import { Badge, Box, Center, Flex, Group } from '@mantine/core';
import Link from 'next/link';
import Logo from '~/components/Logo';
import SearchComponentClient from '~/components/Search/search-client';
import CartButton from '../components/gio-hang-button';
import PromotionButton from '../components/khuyen-mai';
import LikeButton from '../components/yeu-thich';

const Header2 = ({ subCategories }: { subCategories: any }) => {
  const dataSubCategories = subCategories || [];
  return (
    <>
      <Flex
        h={{ base: 'max-content', md: 92 }}
        pl={{ base: 20, lg: 130 }}
        pr={{ base: 20, lg: 130 }}
        justify={'space-between'}
        align={'center'}
        pos={'relative'}
        className='z-[101] bg-gray-100 text-white dark:bg-dark-card dark:text-white'
        direction={{ base: 'column', sm: 'row', md: 'row' }}
        py={{ base: 20, sm: 0 }}
        gap={{ base: 'md', md: 0 }}
      >
        <Link href={'/'}>
          <Center>
            <Logo width={190} />
          </Center>
        </Link>
        <Box w={{ base: '100%', md: 400, lg: 550 }}>
          <SearchComponentClient subCategories={dataSubCategories} />
        </Box>
        <Group>
          <Box className='hidden lg:block' pos={'relative'}>
            <PromotionButton />
            <Badge color='red' size='sm' className='absolute right-[-6px] top-[-8px] animate-wiggle'>
              Hot
            </Badge>
          </Box>
          <LikeButton />
          <CartButton />
        </Group>
      </Flex>
    </>
  );
};

export default Header2;
