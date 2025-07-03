'use client';

import { Group, Tabs, Title } from '@mantine/core';
import { IconBuildingStore, IconPalette } from '@tabler/icons-react';
import { useState } from 'react';
import BannerManagement from './components/banners/banner-management';
import GeneralSettingsManagement from './components/general/general-restautant';

export default function SettingPageClient({ data }: { data: { restaurant: any; banner: any } }) {
  const [activeTab, setActiveTab] = useState<string | null>('general');
  return (
    <>
      <Group justify='space-between' mb='lg'>
        <Title order={2}>Cài đặt</Title>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List mb='xl'>
          <Tabs.Tab value='general' leftSection={<IconBuildingStore size={16} />}>
            Tổng quan
          </Tabs.Tab>
          <Tabs.Tab value='layout' leftSection={<IconPalette size={16} />}>
            Cài đặt banner
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='general'>
          <GeneralSettingsManagement data={data.restaurant} />
        </Tabs.Panel>

        <Tabs.Panel value='layout'>
          <BannerManagement data={data.banner} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
