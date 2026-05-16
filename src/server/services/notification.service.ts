import { Prisma, PrismaClient } from '@prisma/client';
import { getOnlineUserIds } from '~/lib/PusherConfig/handler';
import { pusherServer } from '~/lib/PusherConfig/server';
import { Notification } from '~/shared/schema/notification.schema';

export const createNotificationService = async (db: PrismaClient, input: Notification) => {
  const notification = await db.notification.create({
    data: {
      title: input.title,
      message: input.message,
      type: input.type,
      recipient: input.recipient,
      status: input.status,
      priority: input.priority,
      channels: input.channels,
      createdAt: new Date(),
      template: input.templateId
        ? {
            connect: { id: input.templateId }
          }
        : undefined,
      scheduledAt: input.scheduledAt,
      tags: input.tags,
      analytics: input.analytics,
      recipients:
        input.recipient !== 'all' ? { create: input.userIds?.map(id => ({ user: { connect: { id } } })) } : undefined
    }
  });
  return {
    metaData: {
      before: {},
      after: notification
    }
  };
};

export const getAllNotificationService = async (db: PrismaClient, input?: { include?: Prisma.NotificationInclude }) => {
  const data = await db.notification.findMany({
    include: {
      ...(input?.include ?? {}),
      recipients: {
        include: {
          user: {
            select: {
              id: true,
              email: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return data;
};

export const pushOnlineNotificationService = async (
  db: PrismaClient,
  input: {
    notificationId: string;
    userIds: string[];
  }
) => {
  const notification = await db.notification.findUnique({
    where: { id: input.notificationId },
    include: {
      template: {
        select: {
          category: true,
          variables: true
        }
      }
    }
  });
  if (!notification) throw new Error('Notification not found');
  const onlineUsers = await getOnlineUserIds(input.userIds);
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

  return { count: onlineUsers.length };
};

export const syncOfflineNotificationService = async (db: PrismaClient, input: { userId: string }) => {
  const missed = await db.notification.findMany({
    where: {
      recipient: 'all',
      recipients: { none: { userId: input.userId } }
    },
    include: {
      recipients: {
        include: {
          user: {
            select: {
              id: true,
              email: true
            }
          }
        }
      }
    }
  });

  await Promise.all(
    missed.map(n =>
      db.notificationRecipient.create({
        data: {
          notificationId: n.id,
          userId: input.userId,
          deliveredAt: new Date(),
          sentAt: missed?.[0]?.createdAt || null
        }
      })
    )
  );

  return missed;
};

export const markAsReadNotificationService = async (
  db: PrismaClient,
  input: {
    userId: string;
    notificationId: string;
  }
) => {
  return db.notificationRecipient.updateMany({
    where: {
      notificationId: input.notificationId,
      userId: input.userId
    },
    data: { readAt: new Date() }
  });
};

export const getNotificationByIdService = async (
  db: PrismaClient,
  input: { id: string; include?: Prisma.NotificationInclude }
) => {
  const { id, include } = input;
  return await db.notification.findUnique({ where: { id }, include });
};

export const getNotificationByUserService = async (
  db: PrismaClient,
  input: { userId: string; include?: Prisma.NotificationInclude }
) => {
  const { userId, include } = input;
  const items = await db.notification.findMany({
    where: {
      recipients: {
        some: {
          userId
        }
      }
    },
    include: {
      ...(include ?? {}),
      recipients: {
        where: {
          userId
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  return items;
};

export const updateNotificationService = async (
  db: PrismaClient,
  input: { id: string; data: Partial<Notification> }
) => {
  const { id, ...rest } = input;
  const result = await db.$transaction(async tx => {
    const oldData = id
      ? await tx.notification.findUnique({
          where: { id }
        })
      : null;
    const newData = await tx.notification.update({
      where: { id },
      data: {
        ...(rest ? rest : {}),
        template: rest.data.templateId
          ? {
              connect: { id: rest.data.templateId }
            }
          : undefined
      }
    });

    return { oldData, newData };
  });
  return {
    metaData: {
      before: result.oldData ?? {},
      after: result.newData
    }
  };
};

export const updateActionUserService = async (
  db: PrismaClient,
  input: { where: Prisma.NotificationWhereUniqueInput; data: Prisma.NotificationUpdateInput }
) => {
  const { where, data } = input;

  const result = await db.$transaction(async tx => {
    const oldData = tx.notification.findUnique({ where });
    const newData = tx.notification.update({
      where,
      data
    });
    return { oldData, newData };
  });

  return {
    metaData: {
      before: result.oldData ?? {},
      after: result.newData
    }
  };
};

export const deleteNotificationByIdService = async (db: PrismaClient, input: { ids: string[] }) => {
  const result = await db.notification.deleteMany({ where: { id: { in: input.ids } } });
  return {
    metaData: {
      before: result,
      after: []
    }
  };
};

export const deleteNotificationRecipientService = async (
  db: PrismaClient,
  input: {
    where: Prisma.NotificationRecipientWhereInput;
  }
) => {
  const { where } = input;
  const deleted = await db.notificationRecipient.deleteMany({
    where
  });

  return {
    metaData: {
      before: deleted,
      after: []
    }
  };
};

export const getFilterNotificationService = async (
  db: PrismaClient,
  input: {
    where: Prisma.NotificationWhereInput;
    take?: number;
    skip?: number;
    include?: Prisma.NotificationInclude;
  }
) => {
  const { where, skip, take, include } = input;
  return await db.notification.findMany({
    where,
    skip,
    take,
    include
  });
};
