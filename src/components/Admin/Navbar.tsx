import { Box, Button, Divider, Group, NavLink, ScrollArea, Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconLogout } from '@tabler/icons-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { breakpoints } from '~/constants';
import { navItems } from '~/lib/ConfigUI';
import { GlobalSearch } from '../Search/GlobalSearch';
import UserSection from '../UserSection';

export default function Navbar() {
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.xs}px)`);
  const pathname = usePathname();

  return (
    <>
      <Group px={'md'} mt={'md'} align='flex-end' className='lg:hidden'>
        <UserSection />
        {isMobile && <GlobalSearch width={300} />}
      </Group>
      <ScrollArea.Autosize scrollbarSize={6}>
        <Stack p={10} gap='xs'>
          {navItems.map(item => {
            if (item.children) {
              return (
                <NavLink
                  key={item.label}
                  label={
                    <Text size='sm' fw={700}>
                      {item.label}
                    </Text>
                  }
                  defaultOpened={item.defaultOpened}
                  leftSection={<item.icon size={16} />}
                  childrenOffset={28}
                  classNames={{
                    root: `${item?.href === pathname || item.children.some(child => child.href === pathname) ? '!bg-mainColor/10' : ''} rounded-md hover:bg-mainColor/10 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white`
                  }}
                >
                  <Box className={`border-0 border-l border-solid border-gray-300 pl-2`}>
                    {item.children.map(child => (
                      <Link key={child.label} href={child.href}>
                        <Box
                          key={child.label}
                          py={'xs'}
                          pl={'md'}
                          w={'100%'}
                          className={`${child.href === pathname ? 'bg-mainColor/10' : ''} my-1 rounded-md hover:bg-mainColor/10`}
                        >
                          <Text size='sm' fw={700}>
                            {child.label}
                          </Text>
                        </Box>
                      </Link>
                    ))}
                  </Box>
                </NavLink>
              );
            }
            return (
              <NavLink
                key={item.label}
                label={
                  <Text size='sm' fw={700}>
                    {item.label}
                  </Text>
                }
                classNames={{
                  root: `${item?.href === pathname ? '!bg-mainColor/10' : ''} rounded-md hover:bg-mainColor/10 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white`
                }}
                href={item.href}
                leftSection={<item.icon size={16} />}
              />
            );
          })}

          <Divider />
          <Button variant='danger' className='mb-4' onClick={() => signOut()} leftSection={<IconLogout size={16} />}>
            Đăng xuất
          </Button>
        </Stack>
      </ScrollArea.Autosize>
    </>
  );
}
