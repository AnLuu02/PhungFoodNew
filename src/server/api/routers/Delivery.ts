import { deliverySchema } from '~/lib/ZodSchema/schema';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { ResponseTRPC } from '~/types/ResponseFetcher';

export const deliveryRouter = createTRPCRouter({
  create: publicProcedure.input(deliverySchema).mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
    const delivery = await ctx.db.delivery.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        address: {
          create: {
            ...input.address
          } as any
        },
        note: input.note,
        order: {
          connect: {
            id: input.orderId
          }
        }
      },
      include: {
        address: true
      }
    });
    return {
      code: 'OK',
      message: 'Tạo danh mục thành công.',
      data: delivery
    };
  }),
  update: publicProcedure.input(deliverySchema).mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
    const existingDelivery: any = await ctx.db.delivery.findFirst({
      where: {
        id: input.id
      }
    });

    if (!existingDelivery || (existingDelivery && existingDelivery?.id == input.id)) {
      const delivery = await ctx.db.delivery.update({
        where: { id: input.id },
        data: {
          id: input.id,
          name: input.name,
          email: input.email,
          phone: input.phone,
          address: {
            update: {
              ...input.address
            } as any
          },
          note: input.note,
          order: {
            connect: {
              id: input.orderId
            }
          }
        }
      });
      return {
        code: 'OK',
        message: 'Cập nhật danh mục thành công.',
        data: delivery
      };
    }

    return {
      code: 'CONFLICT',
      message: 'Danh mục đã tồn tại. Hãy thử lại.',
      data: existingDelivery
    };
  })
});
