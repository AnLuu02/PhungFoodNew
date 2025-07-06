'use client';
import { Breadcrumbs, Text } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import tags from '~/constants/tags-vi';

const BreadcrumbsBase = () => {
  const pathname = usePathname();
  const pathArray = pathname.split('/').filter(path => path);
  const titlePath = (path: keyof typeof tags) => {
    if (path.includes('-')) return tags[path];
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
  };
  return (
    <Breadcrumbs separator='>' classNames={{ separator: 'mx-2 text-gray-500' }}>
      <Link
        href='/'
        className={`hover:text-subColor hover:underline ${pathname !== '/' ? 'text-subColor hover:text-subColor hover:underline' : 'text-gray-500'}`}
      >
        <Text size='sm' fw={700}>
          Trang chủ
        </Text>
      </Link>
      {pathArray.map((path, index) => {
        const href = `/${pathArray.slice(0, index + 1).join('/')}`;
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={` ${!isActive ? 'text-subColor hover:text-subColor hover:underline' : 'text-gray-500'} `}
            style={{ pointerEvents: isActive ? 'none' : 'auto', textDecoration: 'none' }}
          >
            <Text size='sm' fw={700}>
              {titlePath(path as keyof typeof tags) ?? path}
            </Text>
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbsBase;
