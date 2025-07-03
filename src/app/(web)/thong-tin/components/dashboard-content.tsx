'use client';

import { Paper, Tabs } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconChartBar, IconGift, IconShoppingCart, IconUser } from '@tabler/icons-react';
import { useState } from 'react';
import { breakpoints, TOP_POSITION_STICKY } from '~/constants';
import classes from './dashboard-content.module.css';
import OrderList from './order-list';
import Promotions from './promotions';
import UserInfo from './user-info';
import UserStatistics from './user-statistics';

type DashboardContentProps = {
  userInfor: any;
  orders: any;
  vouchers: any;
};

export default function DashboardContent({ userInfor, orders, vouchers }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState<string | null>('user-info');
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.sm}px)`);
  let TabPanelContent = null;
  switch (activeTab) {
    case 'user-info':
      TabPanelContent = <UserInfo data={userInfor} />;
      break;
    case 'statistics':
      TabPanelContent = <UserStatistics />;
      break;
    case 'orders':
      TabPanelContent = <OrderList data={orders} />;
      break;
    case 'promotions':
      TabPanelContent = <Promotions data={vouchers} />;
      break;
    default:
      TabPanelContent = null;
  }

  return (
    <Tabs
      variant='pills'
      orientation={isMobile ? 'horizontal' : 'vertical'}
      value={activeTab}
      onChange={setActiveTab}
      classNames={classes}
    >
      <Paper
        className='h-fit'
        pos={{ base: 'relative', sm: 'sticky', xl: 'sticky' }}
        top={{ base: 0, sm: TOP_POSITION_STICKY, xl: TOP_POSITION_STICKY }}
        mr={'md'}
        mb={{ base: 'md', sm: 'md', md: 0, lg: 0 }}
      >
        <Tabs.List pos={'sticky'} top={0}>
          <Tabs.Tab size={'lg'} fw={700} value='user-info' leftSection={<IconUser size={24} />}>
            Thông tin
          </Tabs.Tab>
          <Tabs.Tab size={'lg'} fw={700} value='statistics' leftSection={<IconChartBar size={24} />}>
            Thống kê
          </Tabs.Tab>
          <Tabs.Tab size={'lg'} fw={700} value='orders' leftSection={<IconShoppingCart size={24} />}>
            Đơn hàng
          </Tabs.Tab>
          <Tabs.Tab size={'lg'} fw={700} value='promotions' leftSection={<IconGift size={24} />}>
            Khuyến mãi
          </Tabs.Tab>
        </Tabs.List>
      </Paper>

      <Tabs.Panel value={activeTab || 'user-info'} className='h-fit'>
        {TabPanelContent}
      </Tabs.Panel>
    </Tabs>
  );
}
