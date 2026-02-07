'use client';

import { ActionIcon, Box, Button, Center, Flex, Group, Menu, Skeleton, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconClock, IconWorld } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useMemo } from 'react';
import NotificationDialog from '~/components/NotificationDialog';
import UserSectionDesktop from '~/components/UserSectionDesktop';
import { api } from '~/trpc/react';
import ButtonControlModeTheme from '../../../Button/ButtonControlModeTheme';

export const HeaderClient = () => {
  const { data: restaurant, isLoading } = api.Restaurant.getOneActiveClient.useQuery();
  const restaurantData: any = restaurant ?? {};
  const [language, setLanguage] = useLocalStorage<string>({ key: 'language', defaultValue: 'vn' });
  const timeOpen = useMemo(() => {
    const timeIndex = new Date().getDay();
    const timeOpens = restaurantData?.openingHours ?? [];
    const timeOpen = timeOpens?.find((item: any) => item?.dayOfWeek === timeIndex?.toString());
    return {
      ...timeOpen,
      timeIndex
    };
  }, [restaurantData]);
  const { data: session } = useSession();

  return (
    <>
      {session?.user?.id && <NotificationDialog />}
      <Flex
        direction={{ base: 'column', sm: 'row', md: 'row' }}
        h={{ base: 'max-content', md: 40 }}
        pos={'relative'}
        pl={{ base: 20, lg: 130 }}
        pr={{ base: 20, lg: 130 }}
        pb={{ base: 4, sm: 0 }}
        align={'center'}
        justify={{ base: 'flex-start', sm: 'space-between', md: 'space-between' }}
        className='z-[100] bg-mainColor text-white'
      >
        <Center py={{ base: 'md' }}>
          <Text
            size='sm'
            lineClamp={2}
            className='white-space-nowrap line-clamp-1 animate-bounceSlow overflow-hidden duration-1000'
          >
            Phụng Food! xin chào quý khách!
          </Text>
        </Center>

        <Group align={'center'} justify='center' gap={0}>
          <Group gap='md' align={'center'} justify='center' h={{ base: 40, sm: 'max-content' }}>
            {isLoading ? (
              <Skeleton width={200} height={20} radius={'xl'} />
            ) : (
              <Button
                size='xs'
                radius='xl'
                variant='transparent'
                className='hover:text-subColor'
                leftSection={<IconClock size={16} />}
                classNames={{
                  root: `font-quicksand hover:text-subColor ${!timeOpen?.isClosed ? 'text-white' : 'text-subColor'}`
                }}
              >
                {!timeOpen?.isClosed && timeOpen?.openTime && timeOpen?.closeTime
                  ? `MỞ CỬA: ${timeOpen?.openTime} ĐẾN ${timeOpen?.closeTime}`
                  : `ĐÃ ĐÓNG CỬA`}
              </Button>
            )}

            <Menu radius={'md'} position='bottom-end' shadow='md'>
              <Menu.Target>
                <ActionIcon variant='subtle' color='gray.0' radius='xl' className='hidden md:block'>
                  <IconWorld size={18} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown className='hidden md:block'>
                <Menu.Item
                  onClick={() => setLanguage('vn')}
                  leftSection={
                    <Image
                      loading='lazy'
                      src={'/images/png/co vn.png'}
                      width={language === 'vn' ? 35 : 20}
                      height={language === 'vn' ? 35 : 20}
                      alt='vietnam-flag'
                      style={{ objectFit: 'cover' }}
                      className={`${language === 'vn' ? '' : 'cursor-pointer'}`}
                    />
                  }
                >
                  Tiếng Việt
                </Menu.Item>
                <Menu.Item
                  onClick={() => setLanguage('us')}
                  leftSection={
                    <Image
                      loading='lazy'
                      src={'/images/png/co anh.png'}
                      width={language === 'us' ? 35 : 20}
                      height={language === 'us' ? 35 : 20}
                      alt='english-flag'
                      style={{ objectFit: 'cover' }}
                      className={`${language === 'us' ? '' : 'cursor-pointer'}`}
                    />
                  }
                >
                  English
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <UserSectionDesktop responsive={true} />
            <Box
              pos={{ base: 'fixed', sm: 'unset', md: 'unset', lg: 'fixed' }}
              left={{ base: 5, sm: 0, md: 0, lg: 5 }}
              top={{ base: 8, sm: 15, md: 0, lg: 8 }}
              className='sm:hidden md:block'
              pr={{ md: session ? 40 : 0, lg: 0 }}
            >
              <ButtonControlModeTheme />
            </Box>
          </Group>
        </Group>
      </Flex>
    </>
  );
};
