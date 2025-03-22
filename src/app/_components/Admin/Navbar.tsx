import { Box, NavLink, rem, ScrollArea, Stack, Text } from '@mantine/core';
import {
  IconBrandPolymer,
  IconCategory,
  IconCheese,
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
import { signOut } from 'next-auth/react';
import Link from 'next/link';
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
  return (
    <>
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
