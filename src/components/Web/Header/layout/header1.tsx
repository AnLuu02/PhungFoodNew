'use client';

import { ActionIcon, Box, Button, Center, Flex, Group, Menu, rem, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconClock, IconWorld } from '@tabler/icons-react';
import clsx from 'clsx';
import Image from 'next/image';
import UserSection from '../../../UserSection';
import ControlModeTheme from '../../ControlModeTheme';

export const Header1 = ({ restaurant }: any) => {
  const restaurantData = restaurant ?? {};
  const [language, setLanguage] = useLocalStorage<any>({ key: 'language', defaultValue: 'vn' });
  return (
    <Flex
      direction={{ base: 'column', sm: 'row', md: 'row' }}
      h={{ base: 'max-content', md: 40 }}
      pos={'relative'}
      pl={{ base: rem(20), lg: rem(130) }}
      pr={{ base: rem(20), sm: rem(60), lg: rem(130) }}
      align={'center'}
      justify={{ base: 'flex-start', sm: 'space-between', md: 'space-between' }}
      className='z-[100] bg-mainColor text-white'
    >
      <Center py={{ base: 'md' }}>
        <Text size='sm' lineClamp={2}>
          <b>Phụng Food!</b> xin chào quý khách!
        </Text>
      </Center>

      <Group align={'center'} justify='center' gap={0}>
        <Group gap='md' align={'center'} justify='center'>
          {restaurantData?.openedHours && restaurantData?.closedHours ? (
            <Button
              size='xs'
              radius='xl'
              variant='subtle'
              className='text-white'
              leftSection={<IconClock size={16} />}
              color={!restaurantData?.isClose ? 'blue' : 'red'}
            >
              {!restaurantData?.isClose
                ? `MỞ CỬA: ${restaurantData?.openedHours} ĐẾN ${restaurantData?.closedHours}`
                : `ĐÃ ĐÓNG CỬA: MỞ LẠI LÚC ${restaurantData?.closedHours}`}
            </Button>
          ) : (
            ''
          )}

          <Menu position='bottom-end' shadow='md'>
            <Menu.Target>
              <ActionIcon variant='subtle' color='gray.0' radius='xl' className='hidden lg:block'>
                <IconWorld size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown className='hidden lg:block'>
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
                    className={clsx(language === 'vn' ? '' : 'cursor-pointer')}
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
                    className={clsx(language === 'us' ? '' : 'cursor-pointer')}
                  />
                }
              >
                English
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <UserSection responsive={true} />

          <Box
            pos={{ base: 'fixed', sm: 'unset', md: 'unset', lg: 'fixed' }}
            left={{ base: 5, sm: 0, md: 0, lg: 5 }}
            top={{ base: 8, sm: 15, md: 0, lg: 8 }}
            className='md:hidden lg:block'
          >
            <ControlModeTheme />
          </Box>
        </Group>
      </Group>
    </Flex>
  );
};
