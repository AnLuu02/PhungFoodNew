'use client';
import { Box, rem, ScrollArea, Stack, Text } from '@mantine/core';
import {
  IconCategory,
  IconCheese,
  IconCreditCardPay,
  IconDatabaseDollar,
  IconImageInPicture,
  IconLayoutDashboard,
  IconLogout,
  IconMenuOrder,
  IconTicket,
  IconUser
} from '@tabler/icons-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Tổng quan', icon: IconLayoutDashboard, href: '/admin' },
  { label: 'Ảnh', icon: IconImageInPicture, href: '/admin/images' },

  { label: 'Doanh thu', icon: IconDatabaseDollar, href: '/admin/revenue' },
  { label: 'Danh mục', icon: IconCategory, href: '/admin/category' },
  { label: 'Danh mục con', icon: IconCategory, href: '/admin/subCategory' },

  { label: 'Người dùng', icon: IconUser, href: '/admin/user' },
  { label: 'Phương thức thanh toán', icon: IconCreditCardPay, href: '/admin/payment' },
  { label: 'Sản phẩm', icon: IconCheese, href: '/admin/product' },
  { label: 'Khuyến mãi', icon: IconTicket, href: '/admin/voucher' },
  { label: 'Đánh giá', icon: IconUser, href: '/admin/review' },
  { label: 'Đơn bán hàng', icon: IconMenuOrder, href: '/admin/order' }
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <ScrollArea.Autosize scrollbarSize={6}>
        <Stack p={10} gap='xs'>
          {navItems.map(item => (
            <Link
              key={item.label}
              href={item.href}
              style={{ all: 'unset' }}
              onClick={() => {
                // toggle();
              }}
            >
              <Box
                className={`flex cursor-pointer items-center rounded-lg p-2 transition-colors duration-300 ${
                  item.href === pathname ? 'bg-blue-600 text-white' : 'bg-transparent hover:bg-blue-300'
                }`}
              >
                <item.icon style={{ width: rem(20), height: rem(20), marginRight: '8px' }} />
                <Text size='sm' fw={700}>
                  {item.label}
                </Text>
              </Box>
            </Link>
          ))}
          {/* <NavLink
          href='#required-for-focus'
          label='Quản lí sản phẩm'
          leftSection={<IconGauge size='1rem' stroke={1.5} />}
          childrenOffset={28}
        >
          <NavLink href='#required-for-focus' label='Danh mục' />
          <NavLink leftSection={<IconGauge size='1rem' stroke={1.5} />} label='Sản phẩm' href='Sản phẩm' />
        </NavLink> */}
          <div
            className='mb-4 flex cursor-pointer items-center rounded-lg p-2 transition-colors duration-300 hover:bg-red-500 hover:text-white'
            onClick={() => signOut()}
          >
            <IconLogout style={{ width: rem(20), height: rem(20), marginRight: '8px' }} />
            <Text size='sm' fw={700}>
              Logout
            </Text>
          </div>
        </Stack>
      </ScrollArea.Autosize>
    </>
  );
}
