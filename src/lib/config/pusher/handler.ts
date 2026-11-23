import { pusherServer } from '~/lib/config/pusher/server';

export async function getOnlineUserIds(userIds?: string[]): Promise<string[]> {
  try {
    const res = await pusherServer.get({ path: '/channels/presence-users/users' });
    const data = await res.json();
    const onlineIds = data.users?.map((u: any) => u.id) || [];
    return userIds?.length ? onlineIds.filter((id: string) => userIds.includes(id)) : onlineIds;
  } catch (err) {
    console.error('❌ Failed to get online users:', err);
    return [];
  }
}
