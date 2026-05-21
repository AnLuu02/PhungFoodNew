import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { activityLogger, createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import {
  deleteOrderService,
  findOrderService,
  getAllOrderService,
  getFilterOrderService,
  getOneOrderService,
  updateOrderService,
  upsertOrderService
} from '~/server/services/order.service';
import { baseOrderSchema } from '~/shared/schema/order.schema';

export const orderRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(5),
        s: z.string().optional(),
        filter: z.string().optional().nullable(),
        sort: z.array(z.string()).optional()
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
        where: z.record(z.string(), z.any()),
        data: z.record(z.string(), z.any())
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
