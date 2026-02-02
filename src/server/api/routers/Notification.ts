import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { getOnlineUserIds } from '~/lib/PusherConfig/handler';
import { pusherServer } from '~/lib/PusherConfig/server';
import { notificationSchema } from '~/lib/ZodSchema/schema';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { ResponseTRPC } from '~/types/ResponseFetcher';
export const notificationRouter = createTRPCRouter({
  create: publicProcedure.input(notificationSchema).mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
    const notification = await ctx.db.notification.create({
      data: {
        ...input,
        template: input.templateId
          ? {
              connect: { id: input.templateId }
            }
          : undefined,
        recipients:
          input.recipient !== 'all' ? { create: input.userIds?.map(id => ({ user: { connect: { id } } })) } : undefined
      }
    });
    return { code: 'OK', message: 'Tạo thông báo thành công.', data: notification };
  }),

  getAll: publicProcedure.query(async ({ ctx }): Promise<ResponseTRPC> => {
    const data = await ctx.db.notification.findMany({
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
      },
      orderBy: { createdAt: 'desc' }
    });
    // if (data.length === 0) {
    //   const sample = await ctx.db.notification.create({
    //     data: {
    //       title: 'Chào mừng đến với hệ thống!',
    //       message: 'Đây là thông báo mẫu đầu tiên của bạn.',
    //       type: 'SYSTEM',
    //       recipient: 'all',
    //       status: 'sent',
    //       priority: 'medium',
    //       channels: ['email', 'in_app'],
    //       createdAt: new Date(),
    //       tags: ['sample'],
    //       analytics: { sent: 1, delivered: 1, read: 1, clicked: 0 }
    //     }
    //   });
    //   return { code: 'OK', message: 'Đã tạo dữ liệu mẫu.', data: [sample] };
    // }
    return { code: 'OK', message: 'Lấy danh sách thông báo thành công.', data };
  }),
  pushOnline: publicProcedure
    // .use(requirePermission('create:notification', { requiredAdmin: true }))
    .input(z.object({ notificationId: z.string(), userIds: z.array(z.string()).default([]) }))
    .mutation(async ({ ctx, input }) => {
      const notification = await ctx.db.notification.findUnique({
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
          await ctx.db.notificationRecipient.upsert({
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
    }),
  syncOffline: publicProcedure.input(z.object({ userId: z.string() })).mutation(async ({ ctx, input }) => {
    const missed = await ctx.db.notification.findMany({
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
        ctx.db.notificationRecipient.create({
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
  }),
  markAsRead: publicProcedure
    .input(z.object({ notificationId: z.string(), userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.notificationRecipient.updateMany({
        where: {
          notificationId: input.notificationId,
          userId: input.userId
        },
        data: { readAt: new Date() }
      });
    }),
  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const item = await ctx.db.notification.findUnique({ where: { id: input } });
    return item
      ? { code: 'OK', message: 'Thành công.', data: item }
      : { code: 'NOT_FOUND', message: 'Không tìm thấy thông báo.' };
  }),
  getByUser: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const items = await ctx.db.notification.findMany({
      where: {
        recipients: {
          some: {
            userId: input
          }
        }
      },
      include: {
        recipients: {
          where: {
            userId: input
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return items?.length > 0
      ? { code: 'OK', message: 'Thành công.', data: items }
      : { code: 'NOT_FOUND', message: 'Không tìm thấy thông báo.', data: [] };
  }),

  update: publicProcedure
    .input(z.object({ id: z.string(), data: notificationSchema.partial() }))
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.db.notification.update({
        where: { id: input.id },
        data: {
          ...input.data,
          template: input?.data?.templateId
            ? {
                connect: { id: input?.data?.templateId }
              }
            : undefined
        }
      });
      return { code: 'OK', message: 'Cập nhật thành công.', data: updated };
    }),
  updateActionUser: publicProcedure
    .input(
      z.object({
        where: z.record(z.any()),
        data: z.record(z.any())
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.db.notification.update({
        where: input.where as Prisma.NotificationWhereUniqueInput,
        data: input.data
      });
      return { code: 'OK', message: 'Cập nhật thành công.', data: updated };
    }),
  delete: publicProcedure.input(z.array(z.string())).mutation(async ({ ctx, input }) => {
    await ctx.db.notification.deleteMany({ where: { id: { in: input } } });
    return { code: 'OK', message: 'Xóa thành công.' };
  }),

  deleteFilter: publicProcedure
    .input(
      z.object({
        where: z.record(z.any())
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      try {
        const deleted = await ctx.db.notificationRecipient.deleteMany({
          where: input.where as Prisma.NotificationRecipientWhereInput
        });

        return {
          code: 'OK',
          message: `Đã xóa ${deleted.count} thông báo.`,
          data: deleted
        };
      } catch (error) {
        return {
          code: 'ERROR',
          message: 'Xóa thông báo thất bại.',
          data: error instanceof Error ? error.message : 'Lỗi không xác định'
        };
      }
    }),
  getFilter: publicProcedure
    .input(
      z.object({
        where: z.record(z.any()),
        take: z.number().optional(),
        skip: z.number().optional(),
        include: z.record(z.any()).optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { skip, take, include } = input;
      return await ctx.db.notification.findMany({
        where: input.where as Prisma.NotificationWhereInput,
        skip,
        take,
        include
      });
    })
});
