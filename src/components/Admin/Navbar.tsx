import {
  Avatar,
  Box,
  Divider,
  Group,
  Menu,
  NavLink,
  rem,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconBrandPolymer,
  IconCategory,
  IconCheese,
  IconChevronDown,
  IconCreditCardPay,
  IconDatabaseDollar,
  IconImageInPicture,
  IconLayoutDashboard,
  IconLogout,
  IconMenuOrder,
  IconSettings,
  IconTicket,
  IconUser
} from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { breakpoints } from '~/constants';
import ControlModeTheme from '../ControlModeTheme';
import { GlobalSearch } from '../Search/GlobalSearch';

const navItems = [
  { label: 'Tổng quan', icon: IconLayoutDashboard, href: '/admin' },

  {
    label: 'Quản lý doanh thu',
    icon: IconDatabaseDollar,
    children: [{ label: 'Doanh thu', icon: IconDatabaseDollar, href: '/admin/revenue' }]
  },
  {
    label: 'Quản lý sản phẩm',
    icon: IconCheese,
    children: [
      { label: 'Danh mục', icon: IconCategory, href: '/admin/category' },
      { label: 'Danh mục con', icon: IconCategory, href: '/admin/subCategory' },
      { label: 'Sản phẩm', icon: IconCheese, href: '/admin/product' },
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
      { label: 'Phương thức thanh toán', icon: IconCreditCardPay, href: '/admin/payment' },
      { label: 'Vai trò', icon: IconUser, href: '/admin/role' },
      { label: 'Quyền hạn', icon: IconUser, href: '/admin/permission' }
    ]
  },
  {
    label: 'Quản lý đơn hàng',
    icon: IconMenuOrder,
    children: [{ label: 'Đơn bán hàng', icon: IconMenuOrder, href: '/admin/order' }]
  },
  {
    label: 'Quản lý ảnh',
    icon: IconImageInPicture,
    children: [{ label: 'Ảnh', icon: IconImageInPicture, href: '/admin/images' }]
  },
  {
    label: 'Cài đặt',
    icon: IconSettings,
    children: [{ label: 'Nhà hàng', icon: IconImageInPicture, href: '/admin/settings/restaurant' }]
  }
];

export default function Navbar() {
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.xs}px)`);
  const { data: user } = useSession();

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
                <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <ControlModeTheme />
            <Divider />
            <Link href={`/thong-tin`} className='text-white'>
              <Menu.Item
                fw={500}
                leftSection={<IconUser fontWeight={'bold'} style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
              >
                Thông tin cá nhân
              </Menu.Item>
            </Link>
            <Divider />

            <Menu.Item
              fw={500}
              leftSection={<IconLogout fontWeight={'bold'} style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
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
                  leftSection={<item.icon size={16} />}
                  childrenOffset={28}
                  classNames={{
                    root: 'hover:bg-mainColor/10 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white'
                  }}
                >
                  {item.children.map(child => (
                    <Box key={child.label} py={'xs'} pl={'md'} w={'100%'}>
                      <Link key={child.label} href={child.href} className='hover:text-red-500'>
                        <Text size='sm' fw={700}>
                          {child.label}
                        </Text>
                      </Link>
                    </Box>
                  ))}
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
                href={item.href}
                leftSection={<item.icon size={16} />}
              />
            );
          })}

          <div
            className='mb-4 flex cursor-pointer items-center rounded-lg p-2 transition-colors duration-300 hover:bg-red-500 hover:text-white'
            onClick={() => signOut()}
          >
            <IconLogout style={{ width: rem(20), height: rem(20), marginRight: '8px' }} />
            <Text size='sm' fw={700}>
              Đăng xuất
            </Text>
          </div>
        </Stack>
      </ScrollArea.Autosize>
    </>
  );
}
