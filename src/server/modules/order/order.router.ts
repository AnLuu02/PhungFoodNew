import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { activityLogger, createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { baseOrderSchema } from '~/shared/schema/order.schema';
import {
  deleteOrderService,
  findOrderService,
  getAllOrderService,
  getFilterOrderService,
  getOneOrderService,
  updateOrderService,
  upsertOrderService
} from './order.service';

const adminOrderRouter = createTRPCRouter({
  getSummary: protectedProcedure.query(async ({ ctx }) => {
    const [total, byStatus] = await ctx.db.$transaction([
      ctx.db.order.count(),
      ctx.db.order.groupBy({
        by: ['status'],
        orderBy: { status: 'asc' },
        _count: { _all: true }
      })
    ]);

    return {
      total,
      byStatus: byStatus.map(bs => ({
        status: bs.status,
        count: bs._count && typeof bs._count === 'object' ? (bs._count?._all ?? 0) : 0
      }))
    };
  })
});

export const orderRouter = createTRPCRouter({
  admin: adminOrderRouter,

  find: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(5),
        s: z.string().optional(),
        filter: z.string().optional().nullable(),
        sort: z.array(z.string()).optional(),
        period: z
          .object({
            startTime: z.number().optional(),
            endTime: z.number().optional()
          })
          .optional()
      })
    )
    .query(async ({ ctx, input }) => await findOrderService(ctx.db, input)),

  upsert: publicProcedure
    .use(activityLogger)
    .input(baseOrderSchema)
    .mutation(async ({ ctx, input }) => await upsertOrderService(ctx.db, input)),
  update: publicProcedure
    .use(activityLogger)
    .input(
      z.object({
        where: z.custom<Prisma.OrderWhereUniqueInput>(),
        data: z.custom<Prisma.OrderUpdateInput>()
      })
    )
    .mutation(async ({ ctx, input }) => await updateOrderService(ctx.db, input)),
  delete: publicProcedure
    .use(activityLogger)
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await deleteOrderService(ctx.db, input)),

  getFilter: publicProcedure
    .input(
      z.object({
        s: z.string(),
        period: z.number().optional(),
        include: z.custom<Prisma.OrderInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => getFilterOrderService(ctx.db, input)),
  getOne: publicProcedure
    .input(
      z.object({
        key: z.string(),
        include: z.custom<Prisma.OrderInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await getOneOrderService(ctx.db, input)),
  getAll: publicProcedure
    .input(
      z
        .object({
          include: z.custom<Prisma.OrderInclude>().optional()
        })
        .optional()
    )
    .query(async ({ ctx, input }) => await getAllOrderService(ctx.db, input))
});
