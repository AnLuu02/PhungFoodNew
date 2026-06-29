import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { activityLogger, createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import {
  createNotificationService,
  deleteNotificationByIdService,
  deleteNotificationRecipientService,
  getAllNotificationService,
  getFilterNotificationService,
  getNotificationByIdService,
  getNotificationByUserService,
  markAsReadNotificationService,
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
  markAsRead: publicProcedure
    .input(z.object({ notificationId: z.string(), userId: z.string() }))
    .mutation(async ({ input, ctx }) => await markAsReadNotificationService(ctx.db, input)),
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
        include: z.custom<Prisma.NotificationInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await getNotificationByIdService(ctx.db, input)),
  getByUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        include: z.custom<Prisma.NotificationInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await getNotificationByUserService(ctx.db, input)),

  update: publicProcedure
    .use(activityLogger)
    .input(z.object({ id: z.string(), data: notificationSchema.partial() }))
    .mutation(async ({ ctx, input }) => await updateNotificationService(ctx.db, input)),
  updateActionUser: publicProcedure
    .use(activityLogger)
    .input(
      z.object({
        where: z.custom<Prisma.NotificationWhereUniqueInput>(),
        data: z.custom<Prisma.NotificationUpdateInput>()
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
        where: z.custom<Prisma.NotificationRecipientWhereInput>()
      })
    )
    .mutation(async ({ ctx, input }) => await deleteNotificationRecipientService(ctx.db, input)),
  getFilter: publicProcedure
    .input(
      z.object({
        where: z.custom<Prisma.NotificationWhereInput>(),
        take: z.number().optional(),
        skip: z.number().optional(),
        include: z.custom<Prisma.NotificationInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await getFilterNotificationService(ctx.db, input))
});
