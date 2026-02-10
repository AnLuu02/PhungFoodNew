'use client';

import { Divider, Flex, Paper, Tabs, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconChartBar, IconGift, IconShoppingCart, IconUser } from '@tabler/icons-react';
import { useCallback, useState } from 'react';
import { breakpoints, TOP_POSITION_STICKY } from '~/constants';
import { OrderFilter, UserOne, VoucherForUser } from '~/types/client-type-trpc';
import { OrderList } from './OrderList';
import { Promotions } from './Promotion';
import { UserInfo } from './UserInfo';
import { UserStatistics } from './UserStatistics';

export function DashboardContent({
  userInfor,
  orders,
  vouchers
}: {
  userInfor: UserOne;
  orders: OrderFilter;
  vouchers: VoucherForUser;
}) {
  const [activeTab, setActiveTab] = useState<string | null>('user-info');
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.xs}px)`);

  const renderTabItem = useCallback(
    (activeTab: string) => {
      switch (activeTab) {
        case 'user-info':
          return <UserInfo userInfor={userInfor} />;
        case 'statistics':
          return <UserStatistics />;
        case 'orders':
          return <OrderList orders={orders} />;
        case 'promotions':
          return <Promotions vouchers={vouchers} />;
        default:
          return <UserInfo userInfor={userInfor} />;
      }
    },
    [activeTab]
  );
  return (
    <Tabs
      variant='pills'
      orientation={isMobile ? 'horizontal' : 'vertical'}
      value={activeTab}
      onChange={setActiveTab}
      styles={{
        tab: {
          border: '1px solid ',
          width: '100%',
          borderRadius: 8
        }
      }}
      classNames={{
        tab: `!border-[#e5e5e5] hover:bg-mainColor/10 data-[active=true]:bg-mainColor data-[active=true]:text-white dark:!border-dark-dimmed dark:text-dark-text`,
        list: 'border-b border-mainColor'
      }}
    >
      <Paper
        className={`z-10 h-fit bg-gray-100 dark:bg-dark-card sm:sticky sm:bg-transparent sm:shadow-none sm:dark:bg-transparent sm:top-[${TOP_POSITION_STICKY + 'px'}] fixed bottom-0 left-0 right-0 sm:bottom-[unset] sm:left-[unset] sm:right-[unset]`}
        mr={{ base: 0, md: 'md' }}
        mb={{ base: 0, sm: 'md', md: 0, lg: 0 }}
      >
        <Tabs.List w={{ base: '100%', md: 'max-content' }}>
          <Flex gap={'md'} direction={{ base: 'row', sm: 'column' }} w={'100%'}>
            <Tabs.Tab value='user-info'>
              <Flex align='center' gap={'md'}>
                <IconUser size={24} />
                <Text size={'md'} fw={700} className='hidden sm:block'>
                  Thông tin
                </Text>
              </Flex>
            </Tabs.Tab>
            <Tabs.Tab value='statistics'>
              <Flex align='center' gap={'md'}>
                <IconChartBar size={24} />
                <Text size={'md'} fw={700} className='hidden sm:block'>
                  Thống kê
                </Text>
              </Flex>
            </Tabs.Tab>
            <Tabs.Tab value='orders'>
              <Flex align='center' gap={'md'}>
                <IconShoppingCart size={24} />
                <Text size={'md'} fw={700} className='hidden sm:block'>
                  Đơn hàng
                </Text>
              </Flex>
            </Tabs.Tab>
            <Tabs.Tab value='promotions'>
              <Flex align='center' gap={'md'}>
                <IconGift size={24} />
                <Text size={'md'} fw={700} className='hidden sm:block'>
                  Khuyến mãi
                </Text>
              </Flex>
            </Tabs.Tab>
          </Flex>
        </Tabs.List>
      </Paper>
      <Divider orientation='vertical' size={'sm'} mx={'md'} className='hidden sm:block' />

      <Tabs.Panel value={activeTab || 'user-info'} className='z-1 h-fit max-w-full sm:max-w-[72%] md:max-w-full'>
        {renderTabItem(activeTab || 'user-info')}
      </Tabs.Panel>
    </Tabs>
  );
}
