import { z } from 'zod';

import { activityLogger, createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import {
  confirmVoucherUsageService,
  releaseVoucherUsageService,
  reserveVoucherService
} from '~/server/services/voucherUsage.service';
export const voucherUsageRouter = createTRPCRouter({
  reserveVoucher: publicProcedure
    .use(activityLogger)
    .input(
      z.object({
        userId: z.string(),
        orderId: z.string(),
        vouchers: z.array(
          z.object({
            voucherId: z.string(),
            discountAmount: z.number()
          })
        )
      })
    )
    .mutation(async ({ ctx, input }) => await reserveVoucherService(ctx.db, input)),
  confirmVoucherUsage: publicProcedure
    .use(activityLogger)
    .input(
      z.object({
        userId: z.string(),
        orderId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await confirmVoucherUsageService(ctx.db, input)),
  releaseVoucherUsage: publicProcedure
    .use(activityLogger)
    .input(
      z.object({
        userId: z.string(),
        orderId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await releaseVoucherUsageService(ctx.db, input))
});
