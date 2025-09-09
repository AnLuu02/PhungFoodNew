'use client';

import { Flex, Tabs, Title } from '@mantine/core';
import { IconBuildingStore, IconPalette } from '@tabler/icons-react';
import { useState } from 'react';
import BannerManagement from './components/banners/banner-management';
import GeneralSettingsManagement from './components/general/general-restautant';

export default function SettingPageClient({ data }: { data: { restaurant: any; banner: any } }) {
  const [activeTab, setActiveTab] = useState<string | null>('general');
  return (
    <>
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        variant='pills'
        styles={{
          tab: {
            border: '1px solid',
            marginRight: 6
          }
        }}
        classNames={{
          tab: `!rounded-md !border-[#e5e5e5] !font-bold hover:bg-mainColor/10 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed`
        }}
      >
        <Flex justify='space-between' mb='lg' align={'center'}>
          <Title order={2} className='font-quicksand'>
            Cài đặt
          </Title>
          <Tabs.List>
            <Tabs.Tab value='general' leftSection={<IconBuildingStore size={16} />}>
              Tổng quan
            </Tabs.Tab>
            <Tabs.Tab value='layout' leftSection={<IconPalette size={16} />}>
              Cài đặt banner
            </Tabs.Tab>
          </Tabs.List>
        </Flex>

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
