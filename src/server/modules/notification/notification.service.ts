import { Prisma, PrismaClient } from '@prisma/client';
import { getOnlineUserIds } from '~/lib/PusherConfig/handler';
import { pusherServer } from '~/lib/PusherConfig/server';
import { Notification } from '~/shared/schema/notification.schema';

export const createNotificationService = async (db: PrismaClient, input: Notification) => {
  const notification = await db.$transaction(async tx => {
    const countUsers =
      input.recipient === 'all'
        ? await db.user.count({
            where: {
              email: {
                not: {
                  contains: '@quickbuy.local'
                }
              }
            }
          })
        : undefined;

    return await tx.notification.create({
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
        analytics: {
          create: {
            sent: countUsers ?? input.userIds.length ?? 0
          }
        },
        recipients:
          input.recipient !== 'all' ? { create: input.userIds?.map(id => ({ user: { connect: { id } } })) } : undefined
      }
    });
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
      analytics: true,
      recipients: {
        select: {
          id: true,
          clickedAt: true,
          readAt: true,
          deliveredAt: true,
          sentAt: true
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
  const { userId } = input;

  return await db.$transaction(async tx => {
    const [missed, _] = await Promise.all([
      tx.notification.findMany({
        where: {
          recipient: 'all',
          recipients: { none: { userId } },
          dismissed: { none: { userId } }
        },
        select: {
          id: true,
          createdAt: true,
          analytics: true
        }
      }),
      tx.notificationRecipient.updateMany({
        where: {
          userId,
          deliveredAt: null
        },
        data: {
          deliveredAt: new Date()
        }
      })
    ]);

    if (!missed || missed.length === 0) {
      return [];
    }

    await tx.notificationRecipient.createMany({
      data: missed.map(n => ({
        notificationId: n.id,
        userId,
        deliveredAt: new Date(),
        sentAt: n.createdAt
      })),
      skipDuplicates: true
    });

    await Promise.all(
      missed.map(m => {
        return tx.notificationAnalytics.update({
          where: { notificationId: m.id },
          data: {
            delivered: { increment: 1 }
          }
        });
      })
    );

    return missed;
  });
};

export const getNotificationByUserWithRelationBaseService = async (db: PrismaClient, input: { userId: string }) => {
  const { userId } = input;
  const items = await db.notification.findMany({
    where: {
      recipients: {
        some: {
          userId
        }
      }
    },
    include: {
      analytics: true,
      recipients: {
        where: {
          userId
        },
        select: {
          id: true,
          clickedAt: true,
          readAt: true,
          deliveredAt: true,
          sentAt: true
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
  input: {
    notificationId: string;
    userId: string;
    action: 'sent' | 'delivered' | 'read' | 'clicked';
  }
) => {
  const { notificationId, userId, action } = input;

  const [oldData, newData] = await Promise.all([
    db.notification.findUnique({
      where: {
        id: notificationId
      }
    }),
    db.notification.update({
      where: {
        id: notificationId
      },
      data: {
        analytics: {
          update: {
            data: {
              [action]: {
                increment: 1
              }
            }
          }
        },
        recipients: {
          upsert: {
            where: {
              notificationId_userId: {
                notificationId,
                userId
              }
            },
            create: {
              userId,
              [action + 'At']: new Date()
            },
            update: {
              [action + 'At']: new Date()
            }
          }
        }
      }
    })
  ]);

  return {
    metaData: {
      before: oldData ?? {},
      after: newData
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
    notifications: {
      ids: string[];
      recipientIds: string[];
      userId: string;
    };
  }
) => {
  const {
    notifications: { ids, recipientIds, userId }
  } = input;

  const deleted = await db.$transaction(async tx => {
    const deleted = await tx.notificationRecipient.deleteMany({
      where: { id: { in: recipientIds } }
    });
    if (deleted.count) {
      await tx.notificationDismissed.createMany({
        data: ids.map(notificationId => ({
          dismissedAt: new Date(),
          userId,
          notificationId
        }))
      });
    }

    return deleted;
  });

  return {
    metaData: {
      before: deleted,
      after: []
    }
  };
};
