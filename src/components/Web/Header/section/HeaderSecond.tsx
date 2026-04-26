import { Badge, Box, Divider, Flex, Popover, PopoverDropdown, PopoverTarget } from '@mantine/core';
import { IconHome2, IconSearch } from '@tabler/icons-react';
import Link from 'next/link';
import BButton from '~/components/Button/Button';
import Logo from '~/components/Logo';
import SearchComponentClient from '~/components/Search/SearchClient';
import CartButton from '../components/CartButton';
import LikeButton from '../components/FavouriteButton';
import PromotionButton from '../components/PromotionButton';

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
        className='z-[101] bg-gray-100 text-white dark:bg-dark-card dark:text-dark-text'
        direction={{ base: 'column', sm: 'row' }}
        py={{ base: 20, sm: 0 }}
        gap={{ base: 'md', md: 0 }}
      >
        <Link href={'/'}>
          <div className='flex h-[92px] items-center justify-center'>
            <Logo className='h-4/5 w-auto text-mainColor' />
          </div>
        </Link>
        <Box w={{ base: '100%', md: 450, lg: 600 }} className='hidden sm:block'>
          <SearchComponentClient subCategories={dataSubCategories} />
        </Box>
        <Divider
          variant='dashed'
          size={'sm'}
          w={'80%'}
          className='sm:hidden'
          classNames={{
            root: 'border-mainColor'
          }}
          labelPosition='center'
          label={
            <>
              <IconHome2 size={12} />
              <Box ml={5} className='italic'>
                PhungFoodRes
              </Box>
            </>
          }
        />
        <Flex wrap={'nowrap'} gap={'md'} align={'center'} justify={'center'}>
          <Popover
            transitionProps={{ transition: 'pop-bottom-left' }}
            width={366}
            trapFocus
            position='top'
            shadow='md'
            withOverlay
            offset={120}
            zIndex={10007}
          >
            <PopoverTarget>
              <BButton iconOnly={true} size={'xl'} radius={'xl'} variant='outline' className='sm:hidden'>
                <IconSearch size={20} />
              </BButton>
            </PopoverTarget>
            <PopoverDropdown className='rounded-xl' p={0}>
              <SearchComponentClient subCategories={dataSubCategories} />
            </PopoverDropdown>
          </Popover>
          <Box className='hidden animate-fadeUp lg:block' pos={'relative'} style={{ animationDuration: '0.5s' }}>
            <PromotionButton />
            <Badge color='red' size='sm' className='absolute right-[-6px] top-[-8px] animate-wiggle'>
              Hot
            </Badge>
          </Box>

          <Box className='animate-fadeUp' style={{ animationDuration: '0.75s' }}>
            <LikeButton />
          </Box>

          <Box className='animate-fadeUp' style={{ animationDuration: '1s' }}>
            <CartButton />
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default Header2;
