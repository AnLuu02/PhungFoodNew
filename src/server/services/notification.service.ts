import { Prisma, PrismaClient, RecipientType } from '@prisma/client';
import { getOnlineUserIds } from '~/lib/PusherConfig/handler';
import { pusherServer } from '~/lib/PusherConfig/server';

export const createNotification = async (db: PrismaClient, input: any) => {
  return db.notification.create({
    data: {
      ...input,
      template: input.templateId ? { connect: { id: input.templateId } } : undefined,
      recipients:
        input.recipient !== RecipientType.ALL
          ? {
              create: input.userIds?.map((id: string) => ({
                user: { connect: { id } }
              }))
            }
          : undefined
    }
  });
};

export const getAllNotifications = async (db: PrismaClient) => {
  return db.notification.findMany({
    include: {
      recipients: {
        include: {
          user: {
            select: { id: true, email: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const pushNotificationToOnlineUsers = async (db: PrismaClient, notificationId: string, userIds: string[]) => {
  const notification = await db.notification.findUnique({
    where: { id: notificationId },
    include: {
      template: {
        select: { category: true, variables: true }
      }
    }
  });

  if (!notification) throw new Error('Notification not found');

  const onlineUsers = await getOnlineUserIds(userIds);

  await Promise.all(
    onlineUsers.map(async userId => {
      await db.notificationRecipient.upsert({
        where: {
          notificationId_userId: {
            notificationId: notification.id,
            userId
          }
        },
        update: {},
        create: {
          notificationId: notification.id,
          userId,
          sentAt: new Date()
        }
      });

      await pusherServer.trigger(`user-${userId}`, 'in-app-notify', notification);
    })
  );

  return onlineUsers.length;
};

export const syncOfflineNotifications = async (db: PrismaClient, userId: string) => {
  const missed = await db.notification.findMany({
    where: {
      recipient: RecipientType.ALL,
      recipients: { none: { userId } }
    }
  });

  await Promise.all(
    missed.map(n =>
      db.notificationRecipient.create({
        data: {
          notificationId: n.id,
          userId,
          deliveredAt: new Date(),
          sentAt: n.createdAt
        }
      })
    )
  );

  return missed;
};

export const markNotificationAsRead = async (db: PrismaClient, notificationId: string, userId: string) => {
  return db.notificationRecipient.updateMany({
    where: { notificationId, userId },
    data: { readAt: new Date() }
  });
};

export const getNotificationsByUser = async (db: PrismaClient, userId: string) => {
  return db.notification.findMany({
    where: {
      recipients: { some: { userId } }
    },
    include: {
      recipients: { where: { userId } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const deleteNotifications = async (db: PrismaClient, ids: string[]) => {
  return db.notification.deleteMany({
    where: { id: { in: ids } }
  });
};

export const deleteNotificationRecipientsByFilter = async (
  db: PrismaClient,
  where: Prisma.NotificationRecipientWhereInput
) => {
  return db.notificationRecipient.deleteMany({ where });
};

export const getNotificationsByFilter = async (
  db: PrismaClient,
  args: {
    where: Prisma.NotificationWhereInput;
    skip?: number;
    take?: number;
    include?: Prisma.NotificationInclude;
  }
) => {
  return db.notification.findMany(args);
};
