'use client';

import { ActionIcon, Box, Button, Center, Flex, Group, Menu, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconClock, IconWorld } from '@tabler/icons-react';
import Image from 'next/image';
import { useMemo } from 'react';
import UserSectionDesktop from '~/components/UserSectionDesktop';
import ButtonControlModeTheme from '../../../Button/ButtonControlModeTheme';

export const Header1 = ({ restaurant }: any) => {
  const restaurantData = restaurant ?? {};
  const [language, setLanguage] = useLocalStorage<any>({ key: 'language', defaultValue: 'vn' });
  const timeOpen = useMemo(() => {
    const timeIndex = new Date().getDay();
    const timeOpens = restaurantData?.openingHours ?? [];
    return timeOpens[timeIndex];
  }, [restaurantData]);
  return (
    <Flex
      direction={{ base: 'column', sm: 'row', md: 'row' }}
      h={{ base: 'max-content', md: 40 }}
      pos={'relative'}
      pl={{ base: 20, lg: 130 }}
      pr={{ base: 20, sm: 60, lg: 130 }}
      align={'center'}
      justify={{ base: 'flex-start', sm: 'space-between', md: 'space-between' }}
      className='z-[100] bg-mainColor text-white'
    >
      <Center py={{ base: 'md' }}>
        <Text
          size='sm'
          lineClamp={2}
          className='white-space-nowrap line-clamp-1 animate-bounce overflow-hidden duration-1000'
        >
          Phụng Food! xin chào quý khách!
        </Text>
      </Center>

      <Group align={'center'} justify='center' gap={0}>
        <Group gap='md' align={'center'} justify='center'>
          {timeOpen?.openTime && timeOpen?.closeTime ? (
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
              {!timeOpen?.isClosed ? `MỞ CỬA: ${timeOpen?.openTime} ĐẾN ${timeOpen?.closeTime}` : `ĐÃ ĐÓNG CỬA`}
            </Button>
          ) : (
            ''
          )}

          <Menu position='bottom-end' shadow='md'>
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
          {<UserSectionDesktop responsive={true} />}
          <Box
            pos={{ base: 'fixed', sm: 'unset', md: 'unset', lg: 'fixed' }}
            left={{ base: 5, sm: 0, md: 0, lg: 5 }}
            top={{ base: 8, sm: 15, md: 0, lg: 8 }}
            className='sm:hidden md:block'
          >
            <ButtonControlModeTheme />
          </Box>
        </Group>
      </Group>
    </Flex>
  );
};
