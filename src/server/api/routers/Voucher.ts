import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { activityLogger, createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import {
  createVoucherService,
  deleteVoucherService,
  findVoucherService,
  getAllVoucherService,
  getOneVoucherService,
  getVoucherAppliedAllService,
  getVoucherForUserService,
  updateVoucherService
} from '~/server/services/voucher.service';
import { baseVoucherSchema } from '~/shared/schema/voucher.schema';
export const voucherRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(5),
        filters: z.object({
          s: z.string().optional(),
          status: z.array(z.string()).default([]),
          type: z.string().optional()
        }),
        include: z.custom<Prisma.VoucherInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await findVoucherService(ctx.db, input)),
  create: publicProcedure
    .use(requirePermission('create:voucher'))
    .use(activityLogger)
    .input(baseVoucherSchema)
    .mutation(async ({ ctx, input }) => await createVoucherService(ctx.db, input)),
  delete: publicProcedure
    .use(requirePermission('delete:voucher'))
    .use(activityLogger)
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await deleteVoucherService(ctx.db, input)),

  getAll: publicProcedure
    .input(
      z
        .object({
          include: z.custom<Prisma.VoucherInclude>().optional()
        })
        .optional()
    )
    .query(async ({ ctx, input }) => await getAllVoucherService(ctx.db, input)),
  getVoucherAppliedAll: publicProcedure
    .input(
      z
        .object({
          include: z.custom<Prisma.VoucherInclude>().optional()
        })
        .optional()
    )
    .query(async ({ ctx, input }) => await getVoucherAppliedAllService(ctx.db, input)),
  getOne: publicProcedure
    .input(
      z.object({
        id: z.string(),
        include: z.custom<Prisma.VoucherInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await getOneVoucherService(ctx.db, input)),
  getVoucherForUser: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        include: z.custom<Prisma.VoucherInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await getVoucherForUserService(ctx.db, input)),

  update: publicProcedure
    .use(requirePermission('update:voucher'))
    .use(activityLogger)
    .input(
      z.object({
        where: z.record(z.any()),
        data: z.record(z.any())
      })
    )
    .mutation(async ({ ctx, input }) => await updateVoucherService(ctx.db, input))
});
