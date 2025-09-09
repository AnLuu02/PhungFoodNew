'use client';
import { Avatar, Badge, Box, Divider, Flex, Group, Menu, Text, UnstyledButton } from '@mantine/core';
import { IconChevronDown, IconLogout, IconSettings, IconUser } from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ButtonControlModeTheme from '../ButtonControlModeTheme';
import { GlobalSearch } from '../Search/global-search';

export default function Header() {
  const [userMenuOpened, setUserMenuOpened] = useState(false);
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
        <Badge bg={'red'} radius={'sm'} className='hidden lg:block'>
          {session?.user?.role || 'Super Admin'}
        </Badge>
      </Flex>

      <Flex align={'center'} gap={'md'} className='hidden lg:flex'>
        <GlobalSearch width={{ base: '100%', sm: 350, md: 300, lg: 400 }} />
        <ButtonControlModeTheme />
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
                <Box className='hidden text-left sm:block'>
                  <Text fw={700} size='sm' lh={1}>
                    {session?.user?.name}
                  </Text>
                  <Text size='xs' fw={500} c={'dimmed'}>
                    {session?.user?.email}
                  </Text>
                </Box>
                <IconChevronDown
                  style={{ width: 12, height: 12 }}
                  stroke={1.5}
                  className='hidden text-gray-500 sm:block'
                />
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconUser style={{ width: 16, height: 16 }} stroke={1.5} />}>Profile</Menu.Item>
            <Menu.Item leftSection={<IconSettings style={{ width: 16, height: 16 }} stroke={1.5} />}>
              Settings
            </Menu.Item>
            <Divider />
            <Menu.Item
              leftSection={<IconLogout style={{ width: 16, height: 16 }} stroke={1.5} />}
              color='red'
              onClick={() => signOut({ callbackUrl: 'https://www.facebook.com/' })}
            >
              Đăng xuất
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>
    </Flex>
  );
}
