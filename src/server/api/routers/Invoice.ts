import { z } from 'zod';
import { createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import {
  deleteInvoiceService,
  findInvoiceService,
  getAllInvoiceService,
  getOneInvoiceService,
  upsertInvoiceService
} from '~/server/services/invoice.service';
import { baseInvoiceSchema } from '~/shared/schema/invoice.schema';

export const invoiceRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => await findInvoiceService(ctx.db, input)),
  delete: publicProcedure
    .use(requirePermission('delete:invoice'))
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await deleteInvoiceService(ctx.db, input)),

  getOne: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ ctx, input }) => await getOneInvoiceService(ctx.db, input)),
  getAll: publicProcedure.query(async ({ ctx }) => await getAllInvoiceService(ctx.db)),

  upsert: publicProcedure
    .use(requirePermission('update:invoice'))
    .use(requirePermission('create:invoice'))
    .input(baseInvoiceSchema)
    .mutation(async ({ ctx, input }) => await upsertInvoiceService(ctx.db, input))
});
