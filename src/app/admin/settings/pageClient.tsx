'use client';

import { Center, Paper, Stack, Tabs, Text } from '@mantine/core';
import {
  IconActivity,
  IconBuildingStore,
  IconCreditCard,
  IconHome,
  IconLock,
  IconMail,
  IconPalette
} from '@tabler/icons-react';
import { useCallback } from 'react';
import { useHashTabs } from '~/components/Hooks/use-hash-tabs';
import { api } from '~/trpc/react';
import BannerManagement from './components/Section/Banner/BannerRestautant';
import EmailSettingsManagement from './components/Section/EmailRestautant';
import RestaurantInfoSettings from './components/Section/Infomation/InfoRestautant';
import PaymentSettingsManagement from './components/Section/PaymentRestautant';
import PerformanceSettingsManagement from './components/Section/PerformanceRestautant';
import SecuritySettingsManagement from './components/Section/SecurityRestautant';
import ThemeSettingsManagement from './components/Section/ThemeRestautant';
const TABS: Record<string, { value: string; label: string; icon: any }> = {
  general: { value: 'general', label: 'Cài đặt hệ thống', icon: IconHome },
  banner: { value: 'banner', label: 'Banner', icon: IconBuildingStore },
  email: { value: 'email', label: 'Email', icon: IconMail },
  payment: { value: 'payment', label: 'Thanh toán', icon: IconCreditCard },
  security: { value: 'security', label: 'Bảo mật', icon: IconLock },
  theme: { value: 'theme', label: 'Giao diện', icon: IconPalette },
  performance: { value: 'performance', label: 'Hiệu suất', icon: IconActivity }
};
const DEFAULT_TAB = TABS?.['general']?.value || 'general';
export default function SettingPageClient() {
  const { data: restaurant } = api.Restaurant.getOneActive.useQuery();
  const { activeTab, changeTab } = useHashTabs(Object.keys(TABS), DEFAULT_TAB);
  const renderTabItem = useCallback(
    (activeTab: string) => {
      switch (activeTab) {
        case 'general':
          return <RestaurantInfoSettings />;
        case 'banner':
          return <BannerManagement restaurantId={restaurant?.id || ''} />;
        case 'theme':
          return <ThemeSettingsManagement restaurantId={restaurant?.id || ''} data={restaurant?.theme} />;
        case 'email':
          return <EmailSettingsManagement data={restaurant} />;
        case 'payment':
          return <PaymentSettingsManagement />;
        case 'security':
          return <SecuritySettingsManagement data={restaurant} />;
        case 'performance':
          return <PerformanceSettingsManagement data={restaurant} />;
        default:
          return <RestaurantInfoSettings />;
      }
    },
    [activeTab, restaurant]
  );

  return (
    <Stack>
      <Tabs
        value={activeTab}
        onChange={value => changeTab(value!)}
        orientation='vertical'
        variant='pills'
        styles={{
          tab: {
            border: '1px solid',
            marginRight: 6
          }
        }}
        classNames={{
          tab: `!rounded-md !border-[#e5e5e5] !font-bold hover:bg-mainColor/10 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-dark-text`
        }}
      >
        <Paper withBorder shadow='md' p={'sm'} mr={'md'} className='sticky top-[80px] h-fit'>
          <Text size='md' fw={700} mb={'sm'}>
            Danh mục cài đặt
          </Text>
          <Tabs.List w={230}>
            <Stack gap={'md'}>
              {Object.values(TABS).map(tab => {
                const Icon = tab.icon;
                return (
                  <Tabs.Tab key={tab.value} m={0} value={tab.value} leftSection={<Icon size={16} />}>
                    {tab.label}
                  </Tabs.Tab>
                );
              })}
            </Stack>
            <Center mt={'md'}>
              <Text size='xs' c={'dimmed'}>
                © 2025 PhungFood. All rights reserved.
              </Text>
            </Center>
          </Tabs.List>
        </Paper>

        <Tabs.Panel value={activeTab} className='h-fit'>
          {renderTabItem(activeTab)}
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
