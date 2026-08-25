import { useEffect } from 'react';
import { pusherClient } from '~/lib/PusherConfig/client';
import { NotificationBase } from '~/shared/type-trpc/notification.type-trpc';

interface UseRealtimeNotificationProps {
  userId?: string;
  onReceive: (data: NotificationBase) => Promise<void> | void;
}

export function useRealtimeNotification({ userId, onReceive }: UseRealtimeNotificationProps) {
  useEffect(() => {
    if (!userId) return;

    const presence = pusherClient.subscribe('presence-users');

    const channel = pusherClient.subscribe(`user-${userId}`);

    channel.bind('in-app-notify', onReceive);
    presence.bind('pusher:subscription_succeeded', (members: any) => {});
    return () => {
      channel.unbind('in-app-notify', onReceive);
      channel.unsubscribe();
      presence.unsubscribe();
    };
  }, [userId]);
}
