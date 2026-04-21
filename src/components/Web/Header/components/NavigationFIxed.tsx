'use client';

import { Card, Flex, Text } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigationClientItem } from '~/lib/ConfigUI';

export const NavigationFixed = () => {
  const pathname = usePathname();
  return (
    <Card
      className='bg-backgroundAdmin fixed bottom-0 left-0 right-0 z-[10000] w-full dark:bg-dark-background sm:hidden'
      px={'sm'}
      py={'sm'}
    >
      <Flex align={'center'} justify={'space-between'} w={'100%'}>
        {navigationClientItem.map(item => {
          if (item.order <= 5) {
            const Icon = item.icon;
            return (
              <Link href={item.href} key={item.label}>
                <Flex
                  direction={'column'}
                  align='center'
                  className={pathname === item.href ? `text-mainColor` : 'text-[#94A3B8]'}
                >
                  <Text>
                    <Icon size={24} />
                  </Text>
                  <Text size='xs' fw={600}>
                    {item.label}
                  </Text>
                </Flex>
              </Link>
            );
          }
        })}
      </Flex>
    </Card>
  );
};
