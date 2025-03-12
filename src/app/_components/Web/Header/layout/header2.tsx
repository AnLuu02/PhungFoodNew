'use client';
import { ActionIcon, Box, Center, Flex, Group, Image, rem, Stack, Text } from '@mantine/core';
import { IconPhone } from '@tabler/icons-react';
import Link from 'next/link';
import GlobalSearchMenu from '~/app/(web)/thuc-don/_components/GlobalSearchMenu';
import CartButton from '../_components/gio-hang-button';
import PromotionButton from '../_components/khuyen-mai';
import LikeButton from '../_components/yeu-thich';

const Header2 = () => {
  return (
    <>
      <Flex
        h={{ base: 'max-content', md: 92 }}
        bg={'#f7f7f7'}
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
        <Group gap={10} className='hidden xl:flex'>
          <ActionIcon variant='outline' color='green' radius='xl' size={'xl'}>
            <IconPhone color='green' />
          </ActionIcon>
          <Stack gap={0}>
            <Text size='xs' c={'dimmed'} fw={600}>
              Số điện thoại đường dây nóng
            </Text>
            <Text size='xl' c={'green.9'} className='font-bold'>
              0123456789
            </Text>
          </Stack>
        </Group>
        <Box pos={'relative'} px={rem(20)}>
          <GlobalSearchMenu width={{ base: 300, sm: 250, md: 300 }} />
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
