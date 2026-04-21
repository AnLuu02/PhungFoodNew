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
  updateVoucherService,
  useVoucherService
} from '~/server/services/voucher.service';
import { baseVoucherSchema } from '~/shared/schema/voucher.schema';
export const voucherRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional()
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

  getAll: publicProcedure.query(async ({ ctx }) => await getAllVoucherService(ctx.db)),
  getVoucherAppliedAll: publicProcedure.query(async ({ ctx }) => await getVoucherAppliedAllService(ctx.db)),
  getOne: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ ctx, input }) => await getOneVoucherService(ctx.db, input)),
  getVoucherForUser: publicProcedure
    .input(
      z.object({
        userId: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => await getVoucherForUserService(ctx.db, input)),
  useVoucher: publicProcedure
    .use(activityLogger)
    .input(
      z.object({
        userId: z.string(),
        voucherIds: z.array(z.string())
      })
    )
    .mutation(async ({ ctx, input }) => await useVoucherService(ctx.db, input)),

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
