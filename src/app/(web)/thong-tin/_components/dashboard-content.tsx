'use client';

import { Paper, Tabs } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { UserLevel } from '@prisma/client';
import { IconChartBar, IconGift, IconShoppingCart, IconUser } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { breakpoints } from '~/app/lib/utils/constants/device';
import { getValueLevelUser } from '~/app/lib/utils/func-handler/get--value-level-user';
import { api } from '~/trpc/react';
import classes from './dashboard-content.module.css';
import OrderList from './order-list';
import Promotions from './promotions';
import UserInfo from './user-info';
import UserStatistics from './user-statistics';

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
            someLevel: getValueLevelUser(user?.user?.details?.level || UserLevel.BRONZE)
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
        top={{ base: 0, sm: 70, xl: 70 }}
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
        {activeTab === 'orders' && <OrderList orders={data} isLoading={isLoading} />}
        {activeTab === 'promotions' && <Promotions promotions={data} isLoading={isLoading} />}
      </Tabs.Panel>
    </Tabs>
  );
}
