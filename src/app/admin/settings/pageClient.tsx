'use client';

import { Box, Button, Center, Flex, Group, Paper, Stack, Tabs, Text, Title } from '@mantine/core';
import {
  IconActivity,
  IconBuildingStore,
  IconCreditCard,
  IconFileExport,
  IconFileImport,
  IconHome,
  IconLock,
  IconMail,
  IconPalette,
  IconSettings
} from '@tabler/icons-react';
import { useCallback, useState } from 'react';
import BannerManagement from './components/Section/BannerRestautant';
import EmailSettingsManagement from './components/Section/EmailRestautant';
import RestaurantInfoSettings from './components/Section/InfoRestautant';
import PaymentSettingsManagement from './components/Section/PaymentRestautant';
import PerformanceSettingsManagement from './components/Section/PerformanceRestautant';
import SecuritySettingsManagement from './components/Section/SecurityRestautant';
import ThemeSettingsManagement from './components/Section/ThemeRestautant';
const tabs = [
  { value: 'info', label: 'Cài đặt hệ thống', icon: IconHome },
  { value: 'banner', label: 'Banner', icon: IconBuildingStore },
  { value: 'email', label: 'Email', icon: IconMail },
  { value: 'payment', label: 'Thanh toán', icon: IconCreditCard },
  { value: 'security', label: 'Bảo mật', icon: IconLock },
  { value: 'theme', label: 'Giao diện', icon: IconPalette },
  { value: 'performance', label: 'Hiệu suất', icon: IconActivity }
];
export default function SettingPageClient({ data }: { data: { restaurant: any; banner: any } }) {
  const [activeTab, setActiveTab] = useState<string>('general');
  const renderTabItem = useCallback(
    (activeTab: string) => {
      switch (activeTab) {
        case 'info':
          return <RestaurantInfoSettings data={data?.restaurant} />;
        case 'banner':
          return <BannerManagement data={data?.banner} />;
        case 'email':
          return <EmailSettingsManagement data={data?.restaurant} />;
        case 'payment':
          return <PaymentSettingsManagement />;
        case 'security':
          return <SecuritySettingsManagement data={data?.restaurant} />;
        case 'theme':
          return <ThemeSettingsManagement restaurantId={data?.restaurant?.id} data={data?.restaurant?.theme} />;
        case 'performance':
          return <PerformanceSettingsManagement data={data?.restaurant} />;

        default:
          return <RestaurantInfoSettings data={data?.restaurant} />;
      }
    },
    [activeTab]
  );
  return (
    <Stack>
      <Paper radius={'md'} withBorder shadow='md' py={'xl'} px={'xl'}>
        <Flex align={'center'} justify={'space-between'}>
          <Box>
            <Title className='flex items-center gap-2 font-quicksand' order={3}>
              <IconSettings size={20} />
              Cài đặt hệ thống
            </Title>
            <Text fw={600} size={'sm'} c={'dimmed'}>
              Quản lý và cấu hình các thiết lập cho hệ thống PhungFood
            </Text>
          </Box>
          <Group>
            <Button
              size='sm'
              variant='subtle'
              leftSection={<IconFileImport size={16} />}
              styles={{
                root: {
                  border: '1px solid '
                }
              }}
              classNames={{
                root: `!rounded-md !border-[#e5e5e5] !font-bold text-black hover:bg-mainColor/10 hover:text-black data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-white`
              }}
            >
              Import
            </Button>
            <Button
              size='sm'
              variant='subtle'
              leftSection={<IconFileExport size={16} />}
              styles={{
                root: {
                  border: '1px solid '
                }
              }}
              classNames={{
                root: `!rounded-md !border-[#e5e5e5] !font-bold text-black hover:bg-mainColor/10 hover:text-black data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-white`
              }}
            >
              Export
            </Button>
          </Group>
        </Flex>
      </Paper>

      <Tabs
        value={activeTab}
        onChange={value => setActiveTab(value as string)}
        orientation='vertical'
        variant='pills'
        styles={{
          tab: {
            border: '1px solid',
            marginRight: 6
          }
        }}
        classNames={{
          tab: `!rounded-md !border-[#e5e5e5] !font-bold hover:bg-mainColor/10 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-white`
        }}
      >
        <Paper radius={'md'} withBorder shadow='md' p={'sm'} mr={'md'} className='sticky top-[80px] h-fit'>
          <Text size='md' fw={700} mb={'sm'}>
            Danh mục cài đặt
          </Text>
          <Tabs.List w={230}>
            <Stack gap={'md'}>
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <Tabs.Tab m={0} value={tab.value} leftSection={<Icon size={16} />}>
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
