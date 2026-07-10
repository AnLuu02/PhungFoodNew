'use client';

import { Box, Divider, Flex, Paper, Stack, Tabs, Text, ThemeIcon } from '@mantine/core';
import { IconChartBar, IconChevronRight, IconGift, IconShoppingCart, IconUser } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { AppSkeleton } from '~/components/Skeleton/AppSkeleton';
import { api } from '~/trpc/react';
import { OrderList } from './OrderList';
import { Promotions } from './Promotion';
import { UserInfo } from './UserInfo';
import { UserStatistics } from './UserStatistics';

const tabs = [
  {
    value: 'user-info',
    label: 'Thông tin',
    desc: 'Hồ sơ, địa chỉ, liên hệ',
    icon: IconUser
  },
  {
    value: 'statistics',
    label: 'Thống kê',
    desc: 'Chi tiêu và hoạt động',
    icon: IconChartBar
  },
  {
    value: 'orders',
    label: 'Đơn hàng',
    desc: 'Theo dõi lịch sử mua',
    icon: IconShoppingCart
  },
  {
    value: 'promotions',
    label: 'Khuyến mãi',
    desc: 'Voucher và ưu đãi',
    icon: IconGift
  }
];

export function DashboardContent() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data: overviewUser, isLoading } = api.User.getOverviewUser.useQuery(
    {
      key: userId || ''
    },
    {
      enabled: !!userId
    }
  );
  const user = overviewUser?.user;

  const [activeTab, setActiveTab] = useState<string | null>('user-info');

  const renderTabItem = useMemo(() => {
    if (!user) return;
    switch (activeTab) {
      case 'statistics':
        return <UserStatistics user={user} session={session} />;
      case 'orders':
        return <OrderList session={session} />;
      case 'promotions':
        return <Promotions session={session} />;
      case 'user-info':
        return <UserInfo user={user} session={session} />;
      default:
        return <UserInfo user={user} session={session} />;
    }
  }, [user, activeTab]);

  const utils = api.useUtils();

  useEffect(() => {
    void utils.Order.getFilter.prefetch({ s: userId || '' });
  }, [userId]);

  return (
    <Tabs value={activeTab} onChange={setActiveTab} mt='lg' variant='unstyled'>
      <Flex gap='lg' align='flex-start'>
        <Paper
          p='sm'
          className={`sticky top-24 hidden w-[290px] shrink-0 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.13)] backdrop-blur-xl dark:bg-dark-card dark:shadow-[0_18px_50px_rgba(0,0,0,0.38)] lg:block`}
        >
          <Text px='sm' pt='xs' pb='sm' size='xs' fw={800} c='dimmed' tt='uppercase'>
            Tài khoản của tôi
          </Text>

          <Tabs.List>
            <Stack gap={6} w='100%'>
              {tabs.map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.value;

                return (
                  <>
                    <Tabs.Tab
                      key={tab.value}
                      value={tab.value}
                      w='100%'
                      leftSection={
                        <ThemeIcon
                          size={40}
                          radius='xl'
                          className={
                            active
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 text-slate-600 group-hover:bg-mainColor/10 group-hover:text-mainColor dark:bg-white/10 dark:text-dark-text'
                          }
                        >
                          <Icon size={20} />
                        </ThemeIcon>
                      }
                      rightSection={
                        <IconChevronRight
                          size={17}
                          className={active ? 'opacity-100' : 'opacity-0 transition group-hover:opacity-60'}
                        />
                      }
                      className={[
                        'group justify-start rounded-2xl px-3 py-3 transition-all duration-300',
                        active
                          ? `bg-mainColor text-white`
                          : 'text-slate-700 hover:bg-slate-100 dark:text-dark-text dark:hover:bg-white/5'
                      ].join(' ')}
                    >
                      <Box ta='left'>
                        <Text fw={800} size='sm'>
                          {tab.label}
                        </Text>
                        <Text size='xs' className={active ? 'text-white/75' : 'text-slate-400'}>
                          {tab.desc}
                        </Text>
                      </Box>
                    </Tabs.Tab>
                  </>
                );
              })}
            </Stack>
          </Tabs.List>

          <Divider my='sm' className='opacity-40' />

          <Paper
            p='md'
            className={`bg-white shadow-[0_10px_30px_rgba(15,23,42,0.11)] dark:bg-white/5 dark:shadow-[0_10px_30px_rgba(0,0,0,0.32)]`}
          >
            <Text size='sm' fw={800}>
              Gợi ý hôm nay
            </Text>
            <Text size='xs' c='dimmed' mt={4}>
              Hoàn tất hồ sơ để nhận ưu đãi cá nhân hóa tốt hơn.
            </Text>
          </Paper>
        </Paper>

        <Box className='min-w-0 flex-1 md:pb-24 lg:pb-0'>
          {isLoading ? (
            <AppSkeleton />
          ) : (
            <Paper p={0} className={`animate-[fadeUp_.35s_ease] bg-transparent`}>
              {renderTabItem}
            </Paper>
          )}
        </Box>
      </Flex>

      <Paper
        p={8}
        className={`fixed bottom-[72px] left-3 right-3 z-50 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.13)] backdrop-blur-xl dark:bg-dark-card dark:shadow-[0_18px_50px_rgba(0,0,0,0.38)] lg:hidden`}
      >
        <Tabs.List grow>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.value;

            return (
              <Tabs.Tab
                key={tab.value}
                value={tab.value}
                className={[
                  'rounded-2xl px-2 py-2 transition-all duration-300',
                  active
                    ? `bg-mainColor text-white`
                    : 'text-slate-500 hover:bg-slate-100 dark:text-dark-text dark:hover:bg-white/5'
                ].join(' ')}
              >
                <Stack gap={2} align='center'>
                  <Icon size={21} />
                  <Text size='xs' fw={800}>
                    {tab.label}
                  </Text>
                </Stack>
              </Tabs.Tab>
            );
          })}
        </Tabs.List>
      </Paper>
    </Tabs>
  );
}
