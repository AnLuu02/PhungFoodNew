'use client';

import { Box, Stack, Tabs, TabsList, TabsPanel, TabsTab, Text } from '@mantine/core';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingSpiner from '~/components/Loading/LoadingSpiner';
import { api } from '~/trpc/react';
import { ResponseTRPC } from '~/types/ResponseFetcher';
import { NotificationModal } from './components/modal/cretae_update_notification';
import { ViewModal } from './components/modal/ViewModal';
import { AnalyticsTabSection } from './components/section/AnalyticsTabSection';
import { HistoryTabSection } from './components/section/HistoryTabSection';
import { SendTabSection } from './components/section/SendTabSection';
import { SettingsTabSection } from './components/section/SettingsTabSection';
import { TemplatesTabSection } from './components/section/TemplatesTabSection';
import { NotificationClient } from './types';
export interface SendNotificationStateProps {
  open: boolean;
  typeAction: 'create' | 'update' | 'template';
  recipient?: 'all' | 'individual' | undefined;
  notification?: NotificationClient;
}

const TABS = {
  SEND: 'send',
  HISTORY: 'history',
  TEMPLATES: 'templates',
  ANALYTICS: 'analytics',
  SETTINGS: 'settings'
};
const DEFAULT_TAB = TABS.SEND;
export default function NotificationManagement({
  initData
}: {
  initData: { notifications: ResponseTRPC; templates: ResponseTRPC };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: notificationData } = api.Notification.getAll.useQuery(undefined, {
    initialData: initData.notifications
  });
  const { data: notificationTemplateData } = api.NotificationTemplate.getAll.useQuery(undefined, {
    initialData: initData.templates
  });
  const [mounted, setMounted] = useState(false);
  const notifications = notificationData.data ?? [];
  const templates = notificationTemplateData.data ?? [];
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);
  const [showSendDialog, setShowSendDialog] = useState<SendNotificationStateProps>({
    open: false,
    typeAction: 'create'
  });
  const [showViewDialog, setShowViewDialog] = useState<{
    open: boolean;
    notification?: NotificationClient;
  }>({
    open: false
  });
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      const isValidTab = Object.values(TABS).includes(hash);

      if (isValidTab) {
        setActiveTab(hash);
      } else {
        setActiveTab(DEFAULT_TAB);
      }
      setMounted(true);
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    const newUrl = `${pathname}#${newTab}`;
    router.replace(newUrl, { scroll: false });
  };
  return (
    <Box className='space-y-6' mb={'xl'} pb={'xl'}>
      <Box className='flex items-center justify-between'>
        <Stack gap={'xs'}>
          <Text className='text-3xl font-bold'>Quản lý thông báo</Text>
          <Text>Gửi và quản lý thông báo cho khách hàng của bạn</Text>
        </Stack>
        <Box className='flex gap-2'>
          {/* <BButton
            leftSection={<IconBell size={20} />}
            variant='outline'
            // onClick={() => setShowPreferencesDialog(true)}
          >
            Ưu tiên
          </BButton>
          <BButton
            leftSection={<IconBrandZapier size={20} />}
            variant='outline'
            onClick={() => setShowAutoRulesDialog(true)}
          >
            Quy tắc tự động
          </BButton> */}
          {/* {selectedNotifications.length > 0 && (
            <BButton
              variant='outline'
              //  onClick={() => setShowBulkDialog(true)}
            >
              Hành động hàng loạt ({selectedNotifications.length})
            </BButton>
          )} */}

          <NotificationModal
            opened={showSendDialog.open}
            defaultValues={showSendDialog.notification}
            mode={showSendDialog.typeAction}
            recipient={showSendDialog.recipient}
            onClose={() => setShowSendDialog({ open: false, typeAction: 'create' })}
          />
        </Box>
      </Box>

      {!mounted ? (
        <LoadingSpiner />
      ) : (
        <Tabs
          value={activeTab}
          onChange={(value: any) => handleTabChange(value)}
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
          <TabsList className='grid w-full grid-cols-5' mb={'md'}>
            <TabsTab value='send'>Gửi</TabsTab>
            <TabsTab value='history'>Lịch sử</TabsTab>
            <TabsTab value='templates'>Mẫu</TabsTab>
            <TabsTab value='analytics'>Phân tích</TabsTab>
            <TabsTab value='settings'>Cài đặt</TabsTab>
          </TabsList>

          <TabsPanel value='send' className='space-y-6'>
            <SendTabSection
              setActiveTab={setActiveTab}
              setShowSendDialog={setShowSendDialog}
              notifications={notifications}
            />
          </TabsPanel>

          <TabsPanel value='history' className='space-y-6'>
            <HistoryTabSection
              setShowViewDialog={setShowViewDialog}
              notifications={notifications}
              setShowSendDialog={setShowSendDialog}
            />
          </TabsPanel>

          <TabsPanel value='templates' className='space-y-6'>
            <TemplatesTabSection templates={templates} setShowSendDialog={setShowSendDialog} />
          </TabsPanel>

          <TabsPanel value='analytics' className='space-y-6'>
            <AnalyticsTabSection />
          </TabsPanel>

          <TabsPanel value='settings' className='space-y-6'>
            <SettingsTabSection />
          </TabsPanel>

          <ViewModal
            opened={showViewDialog.open}
            onClose={() => setShowViewDialog({ open: false })}
            selectedNotification={showViewDialog.notification}
            role='admin'
          />
        </Tabs>
      )}
    </Box>
  );
}
