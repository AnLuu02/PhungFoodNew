import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
const findExistingnotification = async (ctx: any, tag: string) => {
  return await ctx.db.notification.findFirst({ where: { tag } });
};
export const notificationRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { skip, take, s } = input;

      const startPageItem = skip > 0 ? (skip - 1) * take : 0;
      const [totalNotifications, totalNotificationsQuery, notifications] = await ctx.db.$transaction([
        ctx.db.notification.count(),
        ctx.db.notification.count({
          where: {
            OR: [
              {
                title: { contains: s?.trim(), mode: 'insensitive' }
              },
              {
                message: { contains: s?.trim(), mode: 'insensitive' }
              },
              {
                user: {
                  some: {
                    OR: [
                      {
                        name: { contains: s?.trim(), mode: 'insensitive' }
                      },
                      {
                        email: { contains: s?.trim(), mode: 'insensitive' }
                      }
                    ]
                  }
                }
              }
            ]
          }
        }),
        ctx.db.notification.findMany({
          skip: startPageItem,
          take,
          where: {
            OR: [
              {
                title: { contains: s?.trim(), mode: 'insensitive' }
              },
              {
                message: { contains: s?.trim(), mode: 'insensitive' }
              },
              {
                user: {
                  some: {
                    OR: [
                      {
                        name: { contains: s?.trim(), mode: 'insensitive' }
                      },
                      {
                        email: { contains: s?.trim(), mode: 'insensitive' }
                      }
                    ]
                  }
                }
              }
            ]
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        })
      ]);
      const totalPages = Math.ceil(
        s?.trim() ? (totalNotificationsQuery == 0 ? 1 : totalNotificationsQuery / take) : totalNotifications / take
      );
      const currentPage = skip ? Math.floor(skip / take + 1) : 1;

      return {
        notifications,
        pagination: {
          currentPage,
          totalPages
        }
      };
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const notification = await ctx.db.notification.delete({
        where: { id: input.id }
      });

      return {
        success: true,
        message: 'Xóa thông báo thành công.',
        record: notification
      };
    }),
  deleteFilter: publicProcedure
    .input(
      z.object({
        where: z.record(z.any())
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const deleted = await ctx.db.notification.deleteMany({
          where: input.where as Prisma.NotificationWhereInput
        });

        return {
          success: true,
          message: `Đã xóa ${deleted.count} thông báo.`,
          record: deleted
        };
      } catch (error) {
        return {
          success: false,
          message: 'Xóa thông báo thất bại.',
          error: error instanceof Error ? error.message : 'Lỗi không xác định'
        };
      }
    }),

  getFilter: publicProcedure
    .input(
      z.object({
        s: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      if (!input.s?.trim()) return [];

      const notification = await ctx.db.notification.findMany({
        where: {
          OR: [
            { id: input.s?.trim() },
            {
              user: {
                some: {
                  OR: [
                    {
                      id: input.s?.trim()
                    },
                    {
                      email: input.s?.trim()
                    }
                  ]
                }
              }
            }
          ]
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      return notification;
    }),
  getOne: publicProcedure
    .input(
      z.object({
        s: z.string(),
        isRead: z.boolean().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const notification = await ctx.db.notification.findFirst({
        where: {
          OR: [{ id: { equals: input.s?.trim() } }, { ...(input.isRead ? { isRead: input.isRead } : undefined) }]
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      return notification;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    let notification = await ctx.db.notification.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return notification;
  }),
  create: publicProcedure
    .input(
      z.object({
        userId: z.array(z.string()),
        title: z.string(),
        message: z.string(),
        isRead: z.boolean(),
        isSendToAll: z.boolean()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const notification = await ctx.db.notification.create({
        data: {
          title: input.title,
          message: input.message,
          isRead: input.isRead,
          isSendToAll: input.isSendToAll,
          user: { connect: input.userId.map(id => ({ id })) }
        }
      });
      return { success: true, message: 'Tạo thông báo thành công.', record: notification };
    }),

  update: publicProcedure
    .input(
      z.object({
        where: z.record(z.any()),
        data: z.record(z.any())
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingNotification = await findExistingnotification(ctx, input.data.id);

      if (existingNotification && existingNotification.id !== input.where.id) {
        return { success: false, message: 'Thông báo đã tồn tại.' };
      }
      const notification = await ctx.db.notification.update({
        where: input.where as Prisma.NotificationWhereUniqueInput,
        data: input.data as Prisma.NotificationUpdateInput
      });
      return { success: true, message: 'Cập nhật thông báo thành công.', record: notification };
    })
});
