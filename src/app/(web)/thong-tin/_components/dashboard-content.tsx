'use client';

import { Paper, Tabs } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconChartBar, IconGift, IconShoppingCart, IconUser } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { TOP_POSITION_STICKY } from '~/app/lib/utils/constants/constant';
import { breakpoints } from '~/app/lib/utils/constants/device';
import { getValueLevelUser } from '~/app/lib/utils/func-handler/get--value-level-user';
import { LocalUserLevel } from '~/app/lib/utils/zod/EnumType';
import { api } from '~/trpc/react';
import classes from './dashboard-content.module.css';
const UserInfo = dynamic(() => import('./user-info'));
const UserStatistics = dynamic(() => import('./user-statistics'));
const OrderList = dynamic(() => import('./order-list'));
const Promotions = dynamic(() => import('./promotions'));
export default function DashboardContent() {
  const { data: user } = useSession();
  const [activeTab, setActiveTab] = useState<string | null>('user-info');
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.sm}px)`);
  const { data, isLoading } =
    activeTab === 'user-info'
      ? api.User.getOne.useQuery({ s: user?.user?.email || '', hasOrders: true })
      : activeTab === 'orders'
        ? api.Order.getFilter.useQuery({ s: user?.user?.email || '' })
        : api.Voucher.getFilter.useQuery({
            applyAllProduct: true,
            someLevel: getValueLevelUser(user?.user?.details?.level || LocalUserLevel.BRONZE)
          });

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
        {activeTab === 'user-info' && <UserInfo user={data} isLoading={isLoading} />}
        {activeTab === 'statistics' && <UserStatistics />}
        {activeTab === 'orders' && <OrderList orders={data ?? ([] as any)} isLoading={isLoading} />}
        {activeTab === 'promotions' && <Promotions promotions={data} isLoading={isLoading} />}
      </Tabs.Panel>
    </Tabs>
  );
}
