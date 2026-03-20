import { z } from 'zod';

import { createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
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
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional(),
        filter: z.string().optional().nullable(),
        sort: z.array(z.string()).optional()
      })
    )
    .query(async ({ ctx, input }) => await findOrderService(ctx.db, input)),

  upsert: publicProcedure
    .input(baseOrderSchema)
    .mutation(async ({ ctx, input }) => await upsertOrderService(ctx.db, input)),
  update: publicProcedure
    .use(requirePermission('update:order'))
    .input(
      z.object({
        where: z.record(z.string(), z.any()),
        data: z.record(z.string(), z.any())
      })
    )
    .mutation(async ({ ctx, input }) => await updateOrderService(ctx.db, input)),
  delete: publicProcedure
    .use(requirePermission('delete:order'))
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
        period: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => getFilterOrderService(ctx.db, input)),
  getOne: publicProcedure
    .input(
      z.object({
        s: z.string()
      })
    )
    .query(async ({ ctx, input }) => await getOneOrderService(ctx.db, input)),
  getAll: publicProcedure.query(async ({ ctx }) => await getAllOrderService(ctx.db))
});
