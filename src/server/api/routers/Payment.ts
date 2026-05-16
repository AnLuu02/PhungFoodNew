import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { activityLogger, createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import {
  deletePaymentService,
  findPaymentService,
  getAllPaymentService,
  getOnePaymentService,
  upsertPaymentService
} from '~/server/services/payment.service';
import { basePaymentSchema } from '~/shared/schema/payment.schema';

export const paymentRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional(),
        include: z.custom<Prisma.PaymentInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await findPaymentService(ctx.db, input)),

  delete: publicProcedure
    .use(requirePermission('delete:payment'))
    .use(activityLogger)
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await deletePaymentService(ctx.db, input)),

  getOne: publicProcedure
    .input(
      z.object({
        id: z.string(),
        include: z.custom<Prisma.PaymentInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await getOnePaymentService(ctx.db, input)),
  getAll: publicProcedure
    .input(
      z
        .object({
          include: z.custom<Prisma.PaymentInclude>().optional()
        })
        .optional()
    )
    .query(async ({ ctx, input }) => await getAllPaymentService(ctx.db, input)),
  upsert: publicProcedure
    .use(requirePermission('update:payment'))
    .use(requirePermission('create:payment'))
    .use(activityLogger)
    .input(basePaymentSchema)
    .mutation(async ({ ctx, input }) => await upsertPaymentService(ctx.db, input))
});
