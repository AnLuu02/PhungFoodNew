import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const deliveryRouter = createTRPCRouter({
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
      const [totalDeliveries, totalDeliveriesQuery, deliveries] = await ctx.db.$transaction([
        ctx.db.delivery.count(),
        ctx.db.delivery.count({
          where: {
            OR: [
              {
                name: { contains: query?.trim(), mode: 'insensitive' }
              }
            ]
          }
        }),
        ctx.db.delivery.findMany({
          skip: startPageItem,
          take,
          where: {
            OR: [
              {
                name: { contains: query?.trim(), mode: 'insensitive' }
              }
            ]
          }
        })
      ]);
      const totalPages = Math.ceil(
        query?.trim() ? (totalDeliveriesQuery == 0 ? 1 : totalDeliveriesQuery / take) : totalDeliveries / take
      );
      const currentPage = skip ? Math.floor(skip / take + 1) : 1;

      return {
        deliveries,
        pagination: {
          currentPage,
          totalPages
        }
      };
    }),
  create: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1, 'Name is required'),
        email: z.string().optional(),
        phone: z.string().optional(),
        province: z.string().optional(),
        address: z.string().optional(),
        note: z.string().optional(),
        userId: z.string().optional(),
        orderId: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const delivery = await ctx.db.delivery.create({
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          province: input.province,
          address: input.address,
          note: input.note,
          userId: input.userId,
          orderId: input.orderId
        }
      });
      return {
        success: true,
        message: 'Tạo danh mục thành công.',
        record: delivery
      };
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1, 'Name is required'),
        email: z.string().optional(),
        phone: z.string().optional(),
        province: z.string().optional(),
        address: z.string().optional(),
        note: z.string().optional(),
        userId: z.string().optional(),
        orderId: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingDelivery: any = await ctx.db.delivery.findFirst({
        where: {
          id: input.id
        }
      });

      if (!existingDelivery || (existingDelivery && existingDelivery?.id == input?.id)) {
        const delivery = await ctx.db.delivery.update({
          where: { id: input?.id },
          data: {
            name: input.name,
            email: input.email,
            phone: input.phone,
            province: input.province,
            address: input.address,
            note: input.note,
            userId: input.userId,
            orderId: input.orderId
          }
        });
        return {
          success: true,
          message: 'Cập nhật danh mục thành công.',
          record: delivery
        };
      }

      return {
        success: false,
        message: 'Danh mục đã tồn tại. Hãy thử lại.',
        record: existingDelivery
      };
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const delivery = await ctx.db.delivery.delete({
        where: { id: input.id }
      });

      return delivery;
    }),

  getFilter: publicProcedure
    .input(
      z.object({
        query: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const delivery = await ctx.db.delivery.findMany({
        where: {
          OR: [
            { id: { contains: input.query, mode: 'insensitive' } }
            // { name: { contains: input.query, mode: 'insensitive' } }
          ]
        }
      });
      if (!delivery) {
        throw new Error(`Stock with ID ${input.query} not found.`);
      }
      return delivery;
    }),
  getOne: publicProcedure
    .input(
      z.object({
        query: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const delivery = await ctx.db.delivery.findFirst({
        where: {
          OR: [
            { id: { contains: input.query, mode: 'insensitive' } }
            // { name: { contains: input.query, mode: 'insensitive' } }
          ]
        }
      });
      if (!delivery) {
        throw new Error(`Stock with ID ${input.query} not found.`);
      }
      return delivery;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const delivery = await ctx.db.delivery.findMany({});
    return delivery;
  })
});
