import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const voucherRouter = createTRPCRouter({
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
      const [totalVouchers, totalVouchersQuery, vouchers] = await ctx.db.$transaction([
        ctx.db.voucher.count(),
        ctx.db.voucher.count({
          where: {
            OR: [
              {
                name: { contains: query?.trim(), mode: 'insensitive' }
              },
              {
                tag: { contains: query?.trim(), mode: 'insensitive' }
              },
              {
                description: { contains: query?.trim(), mode: 'insensitive' }
              }
            ]
          }
        }),
        ctx.db.voucher.findMany({
          skip: startPageItem,
          take,
          where: {
            OR: [
              {
                name: { contains: query?.trim(), mode: 'insensitive' }
              },
              {
                tag: { contains: query?.trim(), mode: 'insensitive' }
              },
              {
                description: { contains: query?.trim(), mode: 'insensitive' }
              }
            ]
          }
        })
      ]);
      const totalPages = Math.ceil(
        query?.trim() ? (totalVouchersQuery == 0 ? 1 : totalVouchersQuery / take) : totalVouchers / take
      );
      const currentPage = skip ? Math.floor(skip / take + 1) : 1;

      return {
        vouchers,
        pagination: {
          currentPage,
          totalPages
        }
      };
    }),
  create: publicProcedure
    .input(
      z.object({
        tag: z.string().min(1, 'Tag không được để trống'),
        name: z.string().min(1, 'Tên voucher không được để trống'),
        description: z.string().optional(),
        type: z.enum(['PERCENTAGE', 'FIXED']),
        discountValue: z.number().min(1, 'Giá trị giảm không hợp lệ'),
        minOrderPrice: z.number().min(0, 'Giá trị tối thiểu không hợp lệ'),
        maxDiscount: z.number().min(0, 'Giá trị tối thiểu không hợp lệ'),
        quantity: z.number().min(1, 'Số lượng không hợp lệ'),
        applyAll: z.boolean().default(false),
        availableQuantity: z.number().min(0).default(0),
        startDate: z.date(),
        endDate: z.date(),
        vipLevel: z.number().optional(),
        products: z.array(z.string()).optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingVoucher = await ctx.db.voucher.findMany({
        where: {
          tag: input.tag
        }
      });

      if (!existingVoucher?.length) {
        const voucher = await ctx.db.voucher.create({
          data: {
            name: input.name,
            tag: input.tag,
            description: input.description,
            type: input.type,
            discountValue: input.discountValue,
            minOrderPrice: input.minOrderPrice,
            maxDiscount: input.maxDiscount,
            quantity: input.quantity,
            availableQuantity: input.availableQuantity,
            startDate: input.startDate,
            endDate: input.endDate,
            applyAll: input.applyAll,
            vipLevel: input.vipLevel,
            products: {
              connect: input?.products?.map(productId => ({ id: productId })) || []
            }
          }
        });
        return {
          success: true,
          message: 'Tạo khuyến mãi thành công.',
          record: voucher
        };
      }
      return {
        success: false,
        message: 'khuyến mãi đã tồn tại. Hãy thử lại.',
        record: existingVoucher
      };
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const voucher = await ctx.db.voucher.delete({
        where: { id: input.id }
      });

      return voucher;
    }),

  getFilter: publicProcedure
    .input(
      z.object({
        query: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const voucher = await ctx.db.voucher.findMany({
        where: {
          OR: [{ id: { contains: input.query, mode: 'insensitive' } }]
        }
      });
      if (!voucher) {
        throw new Error(`Stock with ID ${input.query} not found.`);
      }
      return voucher;
    }),
  getOne: publicProcedure
    .input(
      z.object({
        query: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const voucher = await ctx.db.voucher.findFirst({
        where: {
          OR: [{ id: { contains: input.query, mode: 'insensitive' } }]
        }
      });
      if (!voucher) {
        throw new Error(`Stock with ID ${input.query} not found.`);
      }
      return voucher;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const voucher = await ctx.db.voucher.findMany({});
    return voucher;
  }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        tag: z.string().min(1, 'Tag không được để trống'),
        name: z.string().min(1, 'Tên voucher không được để trống'),
        description: z.string().optional(),
        type: z.enum(['PERCENTAGE', 'FIXED']),
        discountValue: z.number().min(1, 'Giá trị giảm không hợp lệ'),
        minOrderPrice: z.number().min(0, 'Giá trị tối thiểu không hợp lệ'),
        maxDiscount: z.number().min(0, 'Giá trị tối thiểu không hợp lệ'),
        quantity: z.number().min(1, 'Số lượng không hợp lệ'),
        availableQuantity: z.number().min(0).default(0),
        startDate: z.date(),
        endDate: z.date(),
        applyAll: z.boolean().default(false),
        vipLevel: z.number().optional(),
        products: z.array(z.string()).optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingVoucher: any = await ctx.db.voucher.findFirst({
        where: {
          id: input.id
        }
      });

      if (!existingVoucher || (existingVoucher && existingVoucher?.id == input?.id)) {
        const voucher = await ctx.db.voucher.update({
          where: { id: input?.id },
          data: {
            name: input.name,
            tag: input.tag,
            description: input.description,
            type: input.type,
            discountValue: input.discountValue,
            minOrderPrice: input.minOrderPrice,
            maxDiscount: input.maxDiscount,
            quantity: input.quantity,
            availableQuantity: input.availableQuantity,
            startDate: input.startDate,
            endDate: input.endDate,
            vipLevel: input.vipLevel,
            applyAll: input.applyAll,
            products: {
              connect: input?.products?.map(productId => ({ id: productId })) || []
            }
          }
        });
        return {
          success: true,
          message: 'Cập nhật khuyến mãi thành công.',
          record: voucher
        };
      }

      return {
        success: false,
        message: 'khuyến mãi đã tồn tại. Hãy thử lại.',
        record: existingVoucher
      };
    })
});
