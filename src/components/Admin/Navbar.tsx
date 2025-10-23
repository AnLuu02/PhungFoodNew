import { Avatar, Box, Divider, Group, Menu, NavLink, ScrollArea, Stack, Text, UnstyledButton } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconBrandPolymer,
  IconCategory,
  IconCheese,
  IconChevronDown,
  IconCreditCardPay,
  IconDatabaseDollar,
  IconLayoutDashboard,
  IconLogout,
  IconMenuOrder,
  IconReport,
  IconSettings,
  IconTicket,
  IconUser
} from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { breakpoints } from '~/constants';
import ButtonControlModeTheme from '../Button/ButtonControlModeTheme';
import { GlobalSearch } from '../Search/GlobalSearch';

const navItems = [
  { label: 'Tổng quan', icon: IconLayoutDashboard, href: '/admin' },
  {
    label: 'Báo cáo',
    icon: IconDatabaseDollar,
    defaultOpened: true,
    children: [
      { label: 'Báo cáo', icon: IconReport, href: '/admin/reports' },
      { label: 'Analytics', icon: IconReport, href: '/admin/analytics' }
    ]
  },
  {
    label: 'Quản lý sản phẩm',
    icon: IconCheese,

    children: [
      { label: 'Danh mục', icon: IconCategory, href: '/admin/category' },
      { label: 'Mặc hàng', icon: IconCheese, href: '/admin/product' },
      { label: 'Kho hàng', icon: IconCheese, href: '/admin/warehouse' },
      { label: 'Nguyên liệu', icon: IconBrandPolymer, href: '/admin/material' },
      { label: 'Khuyến mãi', icon: IconTicket, href: '/admin/voucher' },
      { label: 'Đánh giá', icon: IconUser, href: '/admin/review' }
    ]
  },
  {
    label: 'Quản lý người dùng',
    icon: IconUser,
    children: [
      { label: 'Người dùng', icon: IconUser, href: '/admin/user' },
      { label: 'Phân quyền', icon: IconUser, href: '/admin/role' }
    ]
  },
  {
    label: 'Quản lý bán hàng',
    icon: IconMenuOrder,
    defaultOpened: true,
    children: [
      { label: 'Đơn bán hàng', icon: IconMenuOrder, href: '/admin/order' },
      { label: 'Hóa đơn', icon: IconMenuOrder, href: '/admin/invoice' },
      { label: 'Liên hệ', icon: IconMenuOrder, href: '/admin/contact' },
      { label: 'Thanh toán', icon: IconCreditCardPay, href: '/admin/payment' }
    ]
  },
  {
    label: 'Cài đặt',
    icon: IconSettings,
    children: [
      { label: 'Hệ thống', icon: IconSettings, href: '/admin/settings' },
      { label: 'Giao diện nâng cao', icon: IconSettings, href: '/admin/settings/theme-advance' }
    ]
  }
];

export default function Navbar() {
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.xs}px)`);
  const { data: user } = useSession();
  const pathname = usePathname();

  return (
    <>
      <Group px={'md'} mt={'md'} align='flex-end' className='lg:hidden'>
        <Menu width={200} position='bottom-end' transitionProps={{ transition: 'fade-down' }} offset={0} withinPortal>
          <Menu.Target>
            <UnstyledButton
              className={`flex items-center rounded-full p-1 transition-colors duration-200 hover:opacity-95`}
            >
              <Group gap={7}>
                <Avatar src={user?.user?.image} alt='User avatar' radius='lg' size={30} />
                <Box className='text-left'>
                  <Text fw={700} size='sm' lh={1}>
                    {user?.user?.name}
                  </Text>
                  <Text size='xs' fw={700} c={'dimmed'}>
                    {user?.user?.email}
                  </Text>
                </Box>
                <IconChevronDown style={{ width: 12, height: 12 }} stroke={1.5} />
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <ButtonControlModeTheme />
            <Divider />
            <Link href={`/thong-tin`} className='text-white'>
              <Menu.Item
                fw={500}
                leftSection={<IconUser fontWeight={'bold'} style={{ width: 16, height: 16 }} stroke={1.5} />}
              >
                Thông tin cá nhân
              </Menu.Item>
            </Link>
            <Divider />

            <Menu.Item
              fw={500}
              leftSection={<IconLogout fontWeight={'bold'} style={{ width: 16, height: 16 }} stroke={1.5} />}
              color='white'
              mt={'xs'}
              className='bg-red-500 hover:bg-red-600'
              onClick={() => {
                signOut({ callbackUrl: 'https://www.facebook.com/' });
              }}
            >
              Đăng xuất
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        {isMobile && <GlobalSearch width={400} />}
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

          <div
            className='mb-4 flex cursor-pointer items-center rounded-md p-2 transition-colors duration-300 hover:bg-red-500 hover:text-white'
            onClick={() => signOut()}
          >
            <IconLogout style={{ width: 20, height: 20, marginRight: '8px' }} />
            <Text size='sm' fw={700}>
              Đăng xuất
            </Text>
          </div>
        </Stack>
      </ScrollArea.Autosize>
    </>
  );
}
