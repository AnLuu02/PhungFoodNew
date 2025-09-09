import { PaymentType } from '@prisma/client';
import { z } from 'zod';
import { seedPayments } from '~/lib/data-test/seed';
import { CreateTagVi } from '~/lib/func-handler/CreateTag-vi';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
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
    .input(
      z.object({
        name: z.string().min(1, 'Tên phương thức không được để trống'),
        tag: z.string(),
        type: z.nativeEnum(PaymentType),
        provider: z.string().optional(),
        isDefault: z.boolean().default(false)
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
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
          code: 'OK',
          message: 'Tạo thành công.',
          data: payment
        };
      }
      return {
        code: 'CONFLICT',
        message: 'Phương thức đã tồn tại. Hãy thử lại.',
        data: existingpayment
      };
    }),
  delete: publicProcedure
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
        name: z.string().min(1, 'Tên phương thức không được để trống'),
        tag: z.string(),
        type: z.nativeEnum(PaymentType),
        provider: z.string().optional(),
        isDefault: z.boolean().default(false)
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
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
          code: 'OK',
          message: 'Cập nhật thành công.',
          data: payment
        };
      }

      return {
        code: 'CONFLICT',
        message: 'Phương thức đã tồn tại. Hãy thử lại.',
        data: existingpayment
      };
    })
});
