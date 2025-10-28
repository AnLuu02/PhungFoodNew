import { z } from 'zod';
import { seedPayments } from '~/lib/DataTest/seed';

import { createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import { ResponseTRPC } from '~/types/ResponseFetcher';

export const paymentRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { skip, take, s } = input;
      const startPageItem = skip > 0 ? (skip - 1) * take : 0;
      const [totalPayments, totalPaymentsQuery, payments] = await ctx.db.$transaction([
        ctx.db.payment.count(),
        ctx.db.payment.count({
          where: {
            name: { contains: s, mode: 'insensitive' }
          }
        }),
        ctx.db.payment.findMany({
          skip: startPageItem,
          take,
          where: {
            name: { contains: s, mode: 'insensitive' }
          }
        })
      ]);
      const totalPages = Math.ceil(
        s ? (totalPaymentsQuery == 0 ? 1 : totalPaymentsQuery / take) : totalPayments / take
      );
      const currentPage = skip ? Math.floor(skip / take + 1) : 1;
      return {
        payments,
        pagination: {
          currentPage,
          totalPages
        }
      };
    }),
  create: publicProcedure
    .use(requirePermission('create:payment'))
    .input(
      z.object({
        provider: z.string(),
        name: z.string(),
        apiKey: z.string().optional(),
        secretKey: z.string().optional(),
        clientId: z.string().optional(),
        clientSecret: z.string().optional(),
        webhookUrl: z.string().optional(),
        webhookSecret: z.string().optional(),
        isSandbox: z.boolean().default(true),
        isActive: z.boolean().default(true),
        metadata: z.any().optional()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const payment = await ctx.db.payment.create({
        data: input
      });
      return {
        code: 'OK',
        message: 'Tạo thành công.',
        data: payment
      };
    }),
  delete: publicProcedure
    .use(requirePermission('delete:payment'))
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const payment = await ctx.db.payment.delete({
        where: { id: input.id }
      });

      return {
        code: 'OK',
        message: 'Xóa phương thức thanh cong.',
        data: payment
      };
    }),

  getOne: publicProcedure
    .input(
      z.object({
        s: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const payment = await ctx.db.payment.findFirst({
        where: {
          OR: [{ id: { contains: input.s, mode: 'insensitive' } }]
        }
      });
      if (!payment) {
        throw new Error(`Payment not found.`);
      }
      return {
        code: 'OK',
        message: 'Lấy phương thức thanh cong.',
        data: payment
      };
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    let payments = await ctx.db.payment.findMany();
    if (!payments?.length) {
      await ctx.db.payment.createMany({
        data: seedPayments
      });
      payments = await ctx.db.payment.findMany();
    }
    return {
      code: 'OK',
      message: 'Lấy phương thức thanh cong.',
      data: payments
    };
  }),

  update: publicProcedure
    .use(requirePermission('update:payment'))
    .input(
      z.object({
        id: z.string(),
        provider: z.string(),
        name: z.string(),
        apiKey: z.string().optional(),
        secretKey: z.string().optional(),
        clientId: z.string().optional(),
        clientSecret: z.string().optional(),
        webhookUrl: z.string().optional(),
        webhookSecret: z.string().optional(),
        isSandbox: z.boolean().default(true),
        isActive: z.boolean().default(true),
        metadata: z.any().optional()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const payment: any = await ctx.db.payment.update({
        where: { id: input?.id },
        data: input
      });
      return {
        code: 'OK',
        message: 'Cập nhật thành công.',
        data: payment
      };
    })
});
