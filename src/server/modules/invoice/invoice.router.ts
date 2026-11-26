import { Prisma } from '@prisma/client';
import { z } from 'zod';
import {
  activityLogger,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  requirePermission
} from '~/server/api/trpc';
import { baseInvoiceSchema } from '~/shared/schema/invoice.schema';
import {
  deleteInvoiceService,
  findInvoiceService,
  getAllInvoiceService,
  getOneInvoiceService,
  upsertInvoiceService
} from './invoice.service';

const adminInvoiceRouter = createTRPCRouter({
  getSummary: protectedProcedure.query(async ({ ctx }) => {
    const [total, byStatus, byCurrency] = await ctx.db.$transaction([
      ctx.db.invoice.count(),
      ctx.db.invoice.groupBy({
        by: ['status'],
        orderBy: { status: 'asc' },
        _count: { _all: true }
      }),
      ctx.db.invoice.groupBy({
        by: ['currency'],
        orderBy: { currency: 'asc' },
        _count: { _all: true }
      })
    ]);

    return {
      total,
      byStatus: byStatus.map(bs => ({
        status: bs.status,
        count: bs._count && typeof bs._count === 'object' ? (bs._count?._all ?? 0) : 0
      })),
      byCurrency: byCurrency.map(bs => ({
        currency: bs.currency,
        count: bs._count && typeof bs._count === 'object' ? (bs._count?._all ?? 0) : 0
      }))
    };
  })
});

export const invoiceRouter = createTRPCRouter({
  admin: adminInvoiceRouter,

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
    .mutation(async ({ ctx, input }) => await upsertInvoiceService(ctx.db, input)),

  getSummary: protectedProcedure.query(async ({ ctx }) => {
    const [total, byStatus] = await ctx.db.$transaction([
      ctx.db.invoice.count({}),
      ctx.db.invoice.groupBy({
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
