import { z } from 'zod';
import { createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import { ResponseTRPC } from '~/types/ResponseFetcher';

export const invoiceRouter = createTRPCRouter({
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
      const [totalInvoices, totalInvoicesQuery, invoices] = await ctx.db.$transaction([
        ctx.db.invoice.count(),
        ctx.db.invoice.count({
          where: {
            OR: [
              {
                orderId: { contains: s, mode: 'insensitive' }
              },
              {
                salerId: { contains: s, mode: 'insensitive' }
              },
              {
                invoiceNumber: { contains: s, mode: 'insensitive' }
              },
              {
                status: { contains: s, mode: 'insensitive' }
              },
              {
                currency: { contains: s, mode: 'insensitive' }
              },
              {
                taxCode: { contains: s, mode: 'insensitive' }
              }
            ]
          }
        }),
        ctx.db.invoice.findMany({
          skip: startPageItem,
          take,
          where: {
            OR: [
              {
                orderId: { contains: s, mode: 'insensitive' }
              },
              {
                salerId: { contains: s, mode: 'insensitive' }
              },
              {
                invoiceNumber: { contains: s, mode: 'insensitive' }
              },
              {
                status: { contains: s, mode: 'insensitive' }
              },
              {
                currency: { contains: s, mode: 'insensitive' }
              },
              {
                taxCode: { contains: s, mode: 'insensitive' }
              }
            ]
          },
          include: {
            saler: true,
            order: {
              include: {
                user: true,
                orderItems: {
                  include: {
                    product: {
                      include: {
                        images: true
                      }
                    }
                  }
                }
              }
            }
          }
        })
      ]);
      const totalPages = Math.ceil(
        s?.trim() ? (totalInvoicesQuery == 0 ? 1 : totalInvoicesQuery / take) : totalInvoices / take
      );
      const currentPage = skip ? Math.floor(skip / take + 1) : 1;

      return {
        invoices,
        pagination: {
          currentPage,
          totalPages
        }
      };
    }),
  create: publicProcedure
    .use(requirePermission('create:invoice'))
    .input(
      z.object({
        orderId: z.string(),
        salerId: z.string(),
        invoiceNumber: z.string(),
        status: z.string().default('PAID'),
        currency: z.string().default('VND'),
        taxCode: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const invoice = await ctx.db.invoice.create({ data: input });
      return {
        code: 'OK',
        message: 'Tạo Hóa đơn thành công.',
        data: invoice
      };
    }),
  delete: publicProcedure
    .use(requirePermission('delete:invoice'))
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const invoice = await ctx.db.invoice.delete({
        where: { id: input.id }
      });
      return {
        code: 'OK',
        message: 'Xóa Hóa đơn thành công.',
        data: invoice
      };
    }),

  getOne: publicProcedure
    .input(
      z.object({
        s: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const invoice = await ctx.db.invoice.findFirst({
        where: {
          OR: [{ id: { equals: input.s?.trim() } }, { invoiceNumber: { equals: input.s?.trim() } }]
        }
      });

      return {
        code: 'OK',
        message: 'Xóa Hóa đơn thành công.',
        data: invoice
      };
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const invoice = await ctx.db.invoice.findMany({
      include: {
        saler: true
      }
    });

    return {
      code: 'OK',
      message: 'Xóa Hóa đơn thành công.',
      data: invoice
    };
  }),

  update: publicProcedure
    .use(requirePermission('update:invoice'))
    .input(
      z.object({
        id: z.string(),
        orderId: z.string(),
        salerId: z.string(),
        invoiceNumber: z.string(),
        status: z.string().default('PAID'),
        currency: z.string().default('VND'),
        taxCode: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const invoice = await ctx.db.invoice.update({
        where: {
          id: input.id
        },
        data: input
      });

      return {
        code: 'OK',
        message: 'Cập nhật Hóa đơn thành công.',
        data: invoice
      };
    })
});
