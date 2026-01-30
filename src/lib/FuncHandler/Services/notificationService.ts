import { pusherServer } from '~/lib/PusherConfig/server';

const BATCH_SIZE = 10;

export async function pushInAppNotify(userIds: string[], data: any) {
  const batches = [];
  for (let i = 0; i < userIds.length; i += BATCH_SIZE) {
    const slice = userIds.slice(i, i + BATCH_SIZE).map(id => ({
      channel: `user-${id}`,
      name: 'in-app-notify',
      data
    }));
    batches.push(slice);
  }

  await Promise.all(batches.map(batch => pusherServer.triggerBatch(batch)));

  return { success: true, sent: userIds.length };
}
