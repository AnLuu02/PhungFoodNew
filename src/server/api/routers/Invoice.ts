import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { activityLogger, createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
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
        page: z.number().default(1),
        limit: z.number().default(5),
        s: z.string().optional(),
        include: z.custom<Prisma.InvoiceInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await findInvoiceService(ctx.db, input)),
  delete: publicProcedure
    .use(requirePermission('delete:invoice'))
    .use(activityLogger)
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await deleteInvoiceService(ctx.db, input)),

  getOne: publicProcedure
    .input(
      z.object({
        key: z.string(),
        include: z.custom<Prisma.InvoiceInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await getOneInvoiceService(ctx.db, input)),
  getAll: publicProcedure
    .input(
      z
        .object({
          include: z.custom<Prisma.InvoiceInclude>().optional()
        })
        .optional()
    )
    .query(async ({ ctx, input }) => await getAllInvoiceService(ctx.db, input)),

  upsert: publicProcedure
    .use(requirePermission('update:invoice'))
    .use(requirePermission('create:invoice'))
    .use(activityLogger)
    .input(baseInvoiceSchema)
    .mutation(async ({ ctx, input }) => await upsertInvoiceService(ctx.db, input))
});
