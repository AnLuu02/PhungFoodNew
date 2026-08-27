'use client';

import { Box, Button, Center, Paper, Stack, Tabs, Text } from '@mantine/core';
import {
  IconAnalyze,
  IconBell,
  IconBrandZapier,
  IconHistory,
  IconSend2,
  IconSettings,
  IconTemplate
} from '@tabler/icons-react';
import { useCallback, useState } from 'react';
import { useHashTabs } from '~/components/Hooks/use-hash-tabs';
import {
  GetAllNotification,
  NotificationBase,
  NotificationTemplateBase
} from '~/shared/type-trpc/notification.type-trpc';
import { api } from '~/trpc/react';
import { ViewNotificationDetail } from '../../../../components/Modals/ViewNotificationDetail';
import { UpsertNotificationModal } from './components/modal/UpsertNotification';
import { AnalyticsTabSection } from './components/section/AnalyticsTabSection';
import { HistoryTabSection } from './components/section/HistoryTabSection';
import { SendTabSection } from './components/section/SendTabSection';
import { SettingsTabSection } from './components/section/SettingsTabSection';
import { TemplatesTabSection } from './components/section/TemplatesTabSection';
export interface SendNotificationStateProps {
  open: boolean;
  typeAction: 'create' | 'update' | 'template';
  recipient?: 'all' | 'individual' | undefined;
  notification?: NotificationBase & { templateId?: string };
}

const TABS = {
  send: { value: 'send', label: 'Gửi thông báo', icon: IconSend2 },
  history: { value: 'history', label: 'Lịch sử đã gửi', icon: IconHistory },
  templates: { value: 'templates', label: 'Mẫu có sẵn', icon: IconTemplate },
  analytics: { value: 'analytics', label: 'Phân tích hành vi', icon: IconAnalyze },
  settings: { value: 'settings', label: 'Cài đặt thông báo', icon: IconSettings }
};
const DEFAULT_TAB = TABS?.['send']?.value || 'send';
export default function NotificationManagement({
  initData
}: {
  initData: { notifications: GetAllNotification; templates: NotificationTemplateBase[] };
}) {
  const { data: notificationData } = api.Notification.getAll.useQuery(undefined, {
    initialData: initData.notifications
  });
  const { data: notificationTemplateData } = api.NotificationTemplate.getTemplatesBase.useQuery(undefined, {
    initialData: initData.templates
  });
  const notifications = notificationData ?? [];
  const templates = notificationTemplateData ?? [];
  const { activeTab, changeTab } = useHashTabs(Object.keys(TABS), DEFAULT_TAB);
  const [showSendDialog, setShowSendDialog] = useState<SendNotificationStateProps>({
    open: false,
    typeAction: 'create'
  });
  const [showViewDialog, setShowViewDialog] = useState<{
    open: boolean;
    notification?: NotificationBase;
  }>({
    open: false
  });

  const renderTabItem = useCallback(
    (activeTab: string) => {
      switch (activeTab) {
        case 'send':
          return (
            <SendTabSection changeTab={changeTab} setShowSendDialog={setShowSendDialog} notifications={notifications} />
          );
        case 'history':
          return (
            <HistoryTabSection
              setShowViewDialog={setShowViewDialog}
              notifications={notifications}
              setShowSendDialog={setShowSendDialog}
            />
          );
        case 'templates':
          return <TemplatesTabSection templates={templates} setShowSendDialog={setShowSendDialog} />;
        case 'analytics':
          return <AnalyticsTabSection />;
        case 'settings':
          return <SettingsTabSection />;

        default:
          return (
            <SendTabSection changeTab={changeTab} setShowSendDialog={setShowSendDialog} notifications={notifications} />
          );
      }
    },
    [activeTab]
  );

  return (
    <>
      <UpsertNotificationModal
        opened={showSendDialog.open}
        defaultValues={showSendDialog.notification}
        mode={showSendDialog.typeAction}
        recipient={showSendDialog.recipient}
        onClose={() => setShowSendDialog({ open: false, typeAction: 'create' })}
      />
      <ViewNotificationDetail
        opened={showViewDialog.open}
        onClose={() => setShowViewDialog({ open: false })}
        selectedNotification={showViewDialog.notification as any}
        role='admin'
      />
      <Stack>
        <Box className='space-y-6'>
          <Box className='flex items-center justify-between'>
            <Stack gap={'xs'}>
              <Text className='text-3xl font-bold'>Quản lý thông báo</Text>
              <Text size='sm' c={'dimmed'}>
                Gửi và quản lý thông báo cho khách hàng của bạn
              </Text>
            </Stack>
            <Box className='flex gap-2'>
              <Button
                leftSection={<IconBell size={20} />}
                variant='outline'
                // onClick={() => setShowPreferencesDialog(true)}
              >
                Ưu tiên
              </Button>
              <Button
                leftSection={<IconBrandZapier size={20} />}
                variant='outline'
                // onClick={() => setShowAutoRulesDialog(true)}
              >
                Quy tắc tự động
              </Button>
              {/* {selectedNotifications.length > 0 && ( */}
              <Button
                variant='outline'
                //  onClick={() => setShowBulkDialog(true)}
              >
                Hành động hàng loạt (10)
              </Button>
              {/* )}  */}
            </Box>
          </Box>
        </Box>

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
            tab: `!border-[#e5e5e5] !font-bold hover:bg-mainColor/10 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-dark-text`
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
            <Stack>{renderTabItem(activeTab)}</Stack>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </>
  );
}
