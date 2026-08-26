import { Metadata } from 'next';
import { api } from '~/trpc/server';
import NotificationManagement from './NotificationManagement';
export const metadata: Metadata = {
  title: 'Cài đặt thông báo'
};

export default async function NotificationPage() {
  const [notifications, templates] = await Promise.all([
    api.Notification.getAll(),
    api.NotificationTemplate.getTemplatesBase()
  ]);
  return <NotificationManagement initData={{ notifications, templates }} />;
}
