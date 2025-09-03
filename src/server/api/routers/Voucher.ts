import { Prisma, VoucherStatus } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { withRedisCache } from '~/lib/cache/withRedisCache';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
export const voucherRouter = createTRPCRouter({
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
      const [totalVouchers, totalVouchersQuery, vouchers] = await ctx.db.$transaction([
        ctx.db.voucher.count(),
        ctx.db.voucher.count({
          where: {
            OR: [
              {
                name: { contains: s?.trim(), mode: 'insensitive' }
              },
              {
                tag: { contains: s?.trim(), mode: 'insensitive' }
              },
              {
                description: { contains: s?.trim(), mode: 'insensitive' }
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
                name: { contains: s?.trim(), mode: 'insensitive' }
              },
              {
                tag: { contains: s?.trim(), mode: 'insensitive' }
              },
              {
                description: { contains: s?.trim(), mode: 'insensitive' }
              }
            ]
          }
        })
      ]);
      const totalPages = Math.ceil(
        s?.trim() ? (totalVouchersQuery == 0 ? 1 : totalVouchersQuery / take) : totalVouchers / take
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
        status: z.enum(['ENABLED', 'DISABLED']),
        discountValue: z.number().min(1, 'Giá trị giảm không hợp lệ'),
        minOrderPrice: z.number().min(0, 'Giá trị tối thiểu không hợp lệ'),
        maxDiscount: z.number().min(0, 'Giá trị tối thiểu không hợp lệ'),
        code: z.string().min(1, 'Ma code khong duoc de trong'),
        quantity: z.number().min(1, 'Số lượng không hợp lệ'),
        quantityForUser: z.number().default(1),
        applyAll: z.boolean().default(false),
        availableQuantity: z.number().min(0).default(0),
        startDate: z.date(),
        endDate: z.date(),
        pointUser: z.number().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const voucher = await ctx.db.voucher.create({
        data: {
          name: input.name,
          tag: input.tag,
          description: input.description,
          type: input.type,
          code: input.code,
          status: input.status,
          discountValue: input.discountValue,
          minOrderPrice: input.minOrderPrice,
          maxDiscount: input.maxDiscount,
          quantity: input.quantity,
          quantityForUser: input.quantityForUser,
          availableQuantity: input.availableQuantity,
          startDate: input.startDate,
          endDate: input.endDate,
          applyAll: input.applyAll,
          pointUser: input.pointUser
        }
      });
      revalidatePath('/admin/voucher');
      return {
        success: true,
        message: 'Tạo khuyến mãi thành công.',
        record: voucher
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

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await withRedisCache(
      'voucher:getAll',
      async () => {
        return await ctx.db.voucher.findMany({});
      },
      60 * 60 * 24
    );
  }),
  getOne: publicProcedure
    .input(
      z.object({
        voucherId: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const voucher = await ctx.db.voucher.findUnique({
        where: {
          id: input.voucherId
        }
      });
      return voucher;
    }),
  getVoucherForUser: publicProcedure
    .input(
      z.object({
        userId: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      let users_db: any;
      if (input.userId && input.userId !== '') {
        users_db = await ctx.db.user.findUnique({
          where: {
            id: input.userId
          },
          select: { pointUser: true }
        });
      }
      const voucher = await ctx.db.voucher.findMany({
        where: {
          status: VoucherStatus.ENABLED,
          startDate: {
            lte: new Date()
          },
          endDate: {
            gte: new Date()
          },
          OR: [
            { applyAll: true },
            {
              voucherForUser: {
                some: {
                  userId: input.userId
                }
              }
            },
            {
              pointUser: users_db?.pointUser
                ? {
                    lte: users_db.pointUser
                  }
                : undefined
            }
          ]
        },
        include: {
          voucherForUser: true
        }
      });
      return voucher;
    }),
  useVoucher: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        voucherIds: z.array(z.string())
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, voucherIds } = input;
      let records = await ctx.db.voucherForUser.findMany({
        where: {
          userId,
          voucherId: { in: voucherIds }
        }
      });

      if (records.length < voucherIds.length) {
        const missingVoucherIds = voucherIds.filter(v => !records.some(r => r.voucherId === v));

        if (missingVoucherIds.length > 0) {
          const vouchers = await ctx.db.voucher.findMany({
            where: { id: { in: missingVoucherIds } },
            select: { id: true, applyAll: true, quantityForUser: true }
          });

          const applyAllVouchers = vouchers.filter(v => v.applyAll);

          if (applyAllVouchers.length > 0) {
            await ctx.db.voucherForUser.createMany({
              data: applyAllVouchers.map(v => ({
                userId,
                voucherId: v.id,
                quantityForUser: v.quantityForUser ?? 1
              })),
              skipDuplicates: true
            });

            records = await ctx.db.voucherForUser.findMany({
              where: { userId, voucherId: { in: voucherIds } }
            });
          }
        }
      }

      if (records.length < voucherIds.length) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Có voucher không hợp lệ cho user này'
        });
      }

      records.forEach(r => {
        if (r.quantityForUser <= 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Voucher ${r.voucherId} đã hết lượt sử dụng`
          });
        }
      });

      await ctx.db.$transaction([
        ctx.db.voucherForUser.updateMany({
          where: {
            userId,
            voucherId: { in: voucherIds }
          },
          data: { quantityForUser: { decrement: 1 } }
        }),
        ctx.db.voucher.updateMany({
          where: {
            id: { in: voucherIds }
          },
          data: {
            usedQuantity: { increment: 1 },
            availableQuantity: { decrement: 1 }
          }
        })
      ]);

      return { success: true };
    }),

  update: publicProcedure
    .input(
      z.object({
        where: z.record(z.any()),
        data: z.record(z.any())
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const existingVoucher: any = await ctx.db.voucher.findFirst({
          where: input.where
        });

        if (!existingVoucher || (existingVoucher && existingVoucher?.id == input?.where?.id)) {
          const updateVoucher = await ctx.db.voucher.update({
            where: input.where as Prisma.VoucherWhereUniqueInput,
            data: input.data as Prisma.VoucherUpdateInput
          });
          return {
            success: true,
            message: 'Cập nhật khuyến mãi thành công.',
            record: updateVoucher
          };
        }

        return {
          success: false,
          message: 'Khuyến mãi đã tồn tại. Hãy thử lại.',
          record: existingVoucher
        };
      } catch (error) {
        return {
          success: false,
          message: 'Lỗi khi cập nhật khuyến mãi. Hãy thử lại.',
          record: error
        };
      }
    })
});
