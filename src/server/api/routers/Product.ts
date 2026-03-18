import { z } from 'zod';

import { createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import {
  deleteProductService,
  findProductService,
  getAllProductService,
  getOneProductService,
  upsertProductService
} from '~/server/services/product.service';
import { productReqSchema } from '~/shared/schema/product.schema';

export const productRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional(),
        filter: z.string().optional(),
        sort: z.array(z.string()).optional(),
        'nguyen-lieu': z.array(z.string()).optional(),
        discount: z.boolean().optional(),
        bestSaler: z.boolean().optional(),
        newProduct: z.boolean().optional(),
        rating: z.number().optional(),
        hotProduct: z.boolean().optional(),
        'danh-muc': z.string().optional(),
        'loai-san-pham': z.string().optional(),
        price: z
          .object({
            min: z.number().optional(),
            max: z.number().optional()
          })
          .optional(),
        userRole: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => await findProductService(ctx.db, input)),
  // create: publicProcedure
  //   .use(requirePermission('create:product'))
  //   .input(productReqSchema)
  //   .mutation(async ({ ctx, input }) => await createProductService(ctx.db, input)),

  // update: publicProcedure
  //   .use(requirePermission('update:product'))
  //   .input(productReqSchema)
  //   .mutation(async ({ ctx, input }) => await updateProductService(ctx.db, input)),
  upsert: publicProcedure
    .use(requirePermission('update:product'))
    .use(requirePermission('create:product'))
    .input(productReqSchema)
    .mutation(async ({ ctx, input }) => await upsertProductService(ctx.db, input)),

  delete: publicProcedure
    .use(requirePermission('delete:product'))
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await deleteProductService(ctx.db, input)),
  // getFilter: publicProcedure
  //   .input(
  //     z.object({
  //       s: z.string().optional(),
  //       hasCategory: z.boolean().default(false).optional(),
  //       hasCategoryChild: z.boolean().default(false).optional(),
  //       hasReview: z.boolean().default(false).optional(),
  //       userRole: z.string().optional()
  //     })
  //   )
  //   .query(async ({ ctx, input }) => await getFilterProductService(ctx.db, input)),

  getOne: publicProcedure
    .input(
      z.object({
        s: z.string(),
        hasCategory: z.boolean().default(false).optional(),
        hasCategoryChild: z.boolean().default(false).optional(),
        hasReview: z.boolean().default(false).optional(),
        hasUser: z.boolean().default(false).optional(),
        userRole: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => await getOneProductService(ctx.db, input)),
  getAll: publicProcedure
    .input(
      z.object({
        hasCategory: z.boolean().default(false).optional(),
        hasCategoryChild: z.boolean().default(false).optional(),
        hasReview: z.boolean().default(false).optional(),
        userRole: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => await getAllProductService(ctx.db, input))

  // getTotalProductSales: publicProcedure.query(async ({ ctx }) => {
  //   const totalProductSales = await ctx.db.product.aggregate({
  //     _sum: {
  //       soldQuantity: true
  //     }
  //   });
  //   return totalProductSales._sum.soldQuantity;
  // }),

  // getProductBestSalerByQuarter: publicProcedure
  //   .input(
  //     z.object({
  //       query: z.enum(['all', 'week', 'month', 'year']).default('week')
  //     })
  //   )
  //   .query(async ({ ctx, input }) => {
  //     const { query }: any = input;
  //     const caller = createCaller(ctx);

  //     const orders: any = await caller.Order.getAll();

  //     let products;
  //     switch (query) {
  //       case 'all':
  //         products = [];
  //         break;
  //       case 'week':
  //         products = orders.filter((order: any) => order.updatedAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  //         break;
  //       case 'month':
  //         products = orders.filter((order: any) => order.updatedAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  //         break;
  //       case 'year':
  //         products = orders.filter((order: any) => order.updatedAt > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000));
  //         break;
  //       default:
  //         products = orders;
  //     }

  //     return products;
  //   })
});
