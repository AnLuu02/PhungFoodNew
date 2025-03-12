'use client';

import {
  ActionIcon,
  Avatar,
  Badge,
  Divider,
  Group,
  Image,
  Menu,
  Switch,
  Text,
  UnstyledButton,
  rem,
  useComputedColorScheme,
  useMantineColorScheme
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconBell, IconChevronDown, IconLogout, IconMoon, IconSettings, IconSun, IconUser } from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { breakpoints } from '~/app/lib/utils/constants/device';
import { GlobalSearch } from './GlobalSearch';

interface HeaderProps {
  opened: boolean;
  toggle: () => void;
}
export default function Header() {
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.sm}px)`);

  const { data: session } = useSession();

  return (
    <Group justify='space-between' h='100%' px='md'>
      <Group>
        <Link href={'/'}>
          <Image loading='lazy' src='/logo/logo_phungfood_1.png' alt='logo' w={150} h={50} p={0} />
        </Link>
        <Badge bg={'red'} radius={'sm'}>
          {session?.user?.role || 'Super Admin'}
        </Badge>
      </Group>

      <Group>
        {!isMobile && <GlobalSearch />}
        <ActionIcon
          variant='subtle'
          color='gray'
          className='relative rounded-full transition-colors duration-200 hover:bg-gray-100'
        >
          <IconBell style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
          <span className='absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500'></span>
        </ActionIcon>

        <Switch
          size='md'
          color='dark.4'
          onChange={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
          onLabel={<IconSun style={{ width: rem(20), height: rem(20) }} stroke={1.5} />}
          offLabel={<IconMoon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />}
        />
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
              className={`flex items-center ${userMenuOpened ? 'bg-gray-100' : ''} rounded-full p-2 transition-colors duration-200 hover:bg-gray-100`}
            >
              <Group gap={7}>
                <Avatar src={session?.user?.image || 'AD'} alt='User avatar' radius='lg' size={30} />
                <div className='hidden text-left sm:block'>
                  <Text fw={700} size='sm' lh={1} className='text-gray-700'>
                    {session?.user?.name}
                  </Text>
                  <Text size='xs' fw={500} className='text-gray-500'>
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
      </Group>
    </Group>
  );
}
