'use client';
import {
  Avatar,
  Badge,
  Divider,
  Flex,
  Group,
  Menu,
  Switch,
  Text,
  UnstyledButton,
  rem,
  useComputedColorScheme,
  useMantineColorScheme
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconChevronDown, IconLogout, IconMoon, IconSettings, IconSun, IconUser } from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { breakpoints } from '~/constants';
import { GlobalSearch } from '../Search/GlobalSearch';

export default function Header() {
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.sm - 1}px)`);
  const isDesktop = useMediaQuery(`(min-width:1024px)`);

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
          <Image src='/logo/logo_phungfood_1.png' alt='logo' width={150} height={50} style={{ objectFit: 'cover' }} />
        </Link>
        {isDesktop && (
          <Badge bg={'red'} radius={'sm'}>
            {session?.user?.role || 'Super Admin'}
          </Badge>
        )}
      </Flex>

      {!isMobile && (
        <Flex align={'center'} gap={'md'}>
          <GlobalSearch width={{ base: '100%', sm: 350, md: 300, lg: 400 }} />
          <Switch
            size='md'
            color='dark.4'
            onChange={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
            onLabel={<IconSun style={{ width: rem(20), height: rem(20) }} stroke={1.5} />}
            offLabel={<IconMoon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />}
          />
          {isDesktop && (
            <Menu
              width={260}
              position='bottom-end'
              transitionProps={{ transition: 'pop-top-right' }}
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
              withinPortal
            >
              <Menu.Target>
                <UnstyledButton
                  className={`flex items-center ${userMenuOpened ? 'bg-[rgba(0,0,0,0.1)]' : ''} rounded-full p-2 transition-colors duration-200 hover:bg-[rgba(0,0,0,0.1)] hover:dark:bg-gray-800/30`}
                >
                  <Group gap={7}>
                    <Avatar src={session?.user?.image || 'AD'} alt='User avatar' radius='lg' size={30} />
                    <div className='hidden text-left sm:block'>
                      <Text fw={700} size='sm' lh={1}>
                        {session?.user?.name}
                      </Text>
                      <Text size='xs' fw={500} c={'dimmed'}>
                        {session?.user?.email}
                      </Text>
                    </div>
                    <IconChevronDown
                      style={{ width: rem(12), height: rem(12) }}
                      stroke={1.5}
                      className='hidden text-gray-500 sm:block'
                    />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}>
                  Profile
                </Menu.Item>
                <Menu.Item leftSection={<IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}>
                  Settings
                </Menu.Item>
                <Divider />
                <Menu.Item
                  leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                  color='red'
                  onClick={() => signOut({ callbackUrl: 'https://www.facebook.com/' })}
                >
                  Đăng xuất
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Flex>
      )}
    </Flex>
  );
}
