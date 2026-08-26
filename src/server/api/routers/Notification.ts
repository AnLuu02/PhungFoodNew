import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { activityLogger, createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import {
  createNotificationService,
  deleteNotificationByIdService,
  deleteNotificationRecipientService,
  getAllNotificationService,
  getNotificationByUserWithRelationBaseService,
  pushOnlineNotificationService,
  syncOfflineNotificationService,
  updateActionUserService,
  updateNotificationService
} from '~/server/services/notification.service';
import { notificationSchema } from '~/shared/schema/notification.schema';
export const notificationRouter = createTRPCRouter({
  create: publicProcedure
    .use(activityLogger)
    .input(notificationSchema)
    .mutation(async ({ ctx, input }) => await createNotificationService(ctx.db, input)),

  getAll: publicProcedure
    .input(
      z
        .object({
          include: z.custom<Prisma.NotificationInclude>().optional()
        })
        .optional()
    )
    .query(async ({ ctx, input }) => await getAllNotificationService(ctx.db, input)),
  pushOnline: publicProcedure
    .input(z.object({ notificationId: z.string(), userIds: z.array(z.string()).default([]) }))
    .mutation(async ({ ctx, input }) => await pushOnlineNotificationService(ctx.db, input)),
  syncOffline: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => await syncOfflineNotificationService(ctx.db, input)),

  getNotificationsByUserWithRelationBase: publicProcedure
    .input(
      z.object({
        userId: z.string()
      })
    )
    .query(async ({ ctx, input }) => await getNotificationByUserWithRelationBaseService(ctx.db, input)),

  update: publicProcedure
    .use(activityLogger)
    .input(z.object({ id: z.string(), data: notificationSchema.partial() }))
    .mutation(async ({ ctx, input }) => await updateNotificationService(ctx.db, input)),
  updateActionUser: publicProcedure
    .use(activityLogger)
    .input(
      z.object({
        notificationId: z.string(),
        userId: z.string(),
        action: z.enum(['sent', 'delivered', 'read', 'clicked'])
      })
    )
    .mutation(async ({ ctx, input }) => await updateActionUserService(ctx.db, input)),
  deleteById: publicProcedure
    .use(activityLogger)
    .input(
      z.object({
        ids: z.array(z.string())
      })
    )
    .mutation(async ({ ctx, input }) => await deleteNotificationByIdService(ctx.db, input)),
  deleteNotificationRecipient: publicProcedure
    .use(activityLogger)
    .input(
      z.object({
        notifications: z.object({
          ids: z.array(z.string()).default([]),
          recipientIds: z.array(z.string()).default([]),
          userId: z.string()
        })
      })
    )
    .mutation(async ({ ctx, input }) => await deleteNotificationRecipientService(ctx.db, input)),

  getBase: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return await ctx.db.notification.findUnique({
      where: {
        id: input.id
      },
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
  })
});
