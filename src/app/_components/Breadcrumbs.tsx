'use client';
import { Breadcrumbs, Text } from '@mantine/core';
import {
  IconBrandMatrix,
  IconBuildingWarehouse,
  IconLayoutDashboard,
  IconSettings,
  IconStack,
  IconStack2Filled,
  IconUser
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import tags from '../lib/utils/constants/tags-vi';

const navItems = [
  { label: 'Dashboard', icon: IconLayoutDashboard, href: '/admin' },
  { label: 'Warehouse', icon: IconBuildingWarehouse, href: '/admin/warehouses' },
  { label: 'Materials', icon: IconBrandMatrix, href: '/admin/materials' },
  { label: 'Stock Management', icon: IconStack, href: '/admin/stock' },
  { label: 'Stock Variants', icon: IconStack2Filled, href: '/admin/stock/variants' },
  { label: 'Profile', icon: IconUser, href: '/admin/thong-tin' },
  { label: 'Settings', icon: IconSettings, href: '/admin/setting' }
];

const BreadcrumbsComponent = () => {
  const pathname = usePathname();
  const pathArray = pathname.split('/').filter(path => path);
  const titlePath = (path: keyof typeof tags) => {
    if (path.includes('-')) return tags[path];
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
  };
  return (
    <Breadcrumbs separator='>' classNames={{ separator: 'mx-2 text-gray-500' }}>
      <Link href='/' className={`flex items-center text-gray-500 no-underline hover:text-[#f8c144] hover:underline`}>
        {/* <IconHome className='mr-1 h-4 w-4' /> */}
        <Text size='sm' fw={700}>
          Trang chủ
        </Text>
      </Link>
      {pathArray.map((path, index) => {
        const href = `/${pathArray.slice(0, index + 1).join('/')}`;
        const icon = navItems.find(item => item.href === href);
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center ${isActive ? 'text-[#f8c144]' : 'text-gray-500'} no-underline hover:text-[#f8c144] hover:underline`}
            style={{ pointerEvents: isActive ? 'none' : 'auto', textDecoration: 'none' }}
          >
            {icon && <icon.icon className='mr-1 h-4 w-4' />}
            <Text size='sm' fw={700}>
              {titlePath(path as keyof typeof tags) ?? path}
            </Text>
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbsComponent;
