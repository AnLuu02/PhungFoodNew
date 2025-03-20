import { PaymentType } from '@prisma/client';
import { z } from 'zod';
import { seedPayments } from '~/app/lib/utils/data-test/seed';
import { CreateTagVi } from '~/app/lib/utils/func-handler/CreateTag-vi';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const paymentRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        query: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { skip, take, query } = input;
      const startPageItem = skip > 0 ? (skip - 1) * take : 0;
      const [totalPayments, totalPaymentsQuery, payments] = await ctx.db.$transaction([
        ctx.db.payment.count(),
        ctx.db.payment.count({
          where: {
            name: { contains: query, mode: 'insensitive' }
          }
        }),
        ctx.db.payment.findMany({
          skip: startPageItem,
          take,
          where: {
            name: { contains: query, mode: 'insensitive' }
          }
        })
      ]);
      const totalPages = Math.ceil(
        query ? (totalPaymentsQuery == 0 ? 1 : totalPaymentsQuery / take) : totalPayments / take
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
    .input(
      z.object({
        name: z.string().min(1, 'Name is required'),
        tag: z.string(),
        type: z.nativeEnum(PaymentType),
        provider: z.string().optional(),
        isDefault: z.boolean().default(false)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingpayment = await ctx.db.payment.findMany({
        where: {
          tag: input.tag
        }
      });

      if (!existingpayment?.length) {
        const payment = await ctx.db.payment.create({
          data: {
            name: input.name,
            tag: input.tag,
            type: input.type,
            provider: input.provider || '',
            isDefault: input.isDefault
          }
        });
        if (payment?.tag) {
          await CreateTagVi({ old: [], new: payment });
        }
        return {
          success: true,
          message: 'Tạo thành công.',
          record: payment
        };
      }
      return {
        success: false,
        message: 'Phương thức đã tồn tại. Hãy thử lại.',
        record: existingpayment
      };
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const payment = await ctx.db.payment.delete({
        where: { id: input.id }
      });

      return payment;
    }),

  getFilter: publicProcedure
    .input(
      z.object({
        query: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const payment = await ctx.db.payment.findMany({
        where: {
          OR: [{ id: { contains: input.query, mode: 'insensitive' } }]
        }
      });
      if (!payment) {
        throw new Error(`Payment not found.`);
      }
      return payment;
    }),
  getOne: publicProcedure
    .input(
      z.object({
        query: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const payment = await ctx.db.payment.findFirst({
        where: {
          OR: [{ id: { contains: input.query, mode: 'insensitive' } }]
        }
      });
      if (!payment) {
        throw new Error(`Payment not found.`);
      }
      return payment;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    let payment = await ctx.db.payment.findMany();
    if (!payment?.length) {
      await ctx.db.payment.createMany({
        data: seedPayments
      });
      payment = await ctx.db.payment.findMany();
    }
    return payment;
  }),

  update: publicProcedure
    .input(
      z.object({
        paymentId: z.string(),
        name: z.string().min(1, 'Name is required'),
        tag: z.string(),
        type: z.nativeEnum(PaymentType),
        provider: z.string().optional(),
        isDefault: z.boolean().default(false)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingpayment: any = await ctx.db.payment.findMany({
        where: {
          id: input.paymentId
        }
      });

      if (!existingpayment || (existingpayment && existingpayment?.some((item: any) => item?.id == input?.paymentId))) {
        const [payment, updatePayment] = await ctx.db.$transaction([
          ctx.db.payment.findUnique({
            where: { id: input?.paymentId }
          }),
          ctx.db.payment.update({
            where: { id: input?.paymentId },
            data: {
              name: input.name,
              tag: input.tag,
              type: input.type,
              provider: input.provider || '',
              isDefault: input.isDefault
            }
          })
        ]);
        if (payment?.tag && updatePayment?.tag) {
          await CreateTagVi({ old: payment, new: updatePayment });
        }
        return {
          success: true,
          message: 'Cập nhật thành công.',
          record: payment
        };
      }

      return {
        success: false,
        message: 'Phương thức đã tồn tại. Hãy thử lại.',
        record: existingpayment
      };
    })
});
