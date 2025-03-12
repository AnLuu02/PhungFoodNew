import { z } from 'zod';
import { addressSchema } from '~/app/lib/utils/zod/zodShcemaForm';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const deliveryRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1, 'Name là bắt buộc'),
        email: z.string().min(1, 'Email là bắt buộc'),
        phone: z.string().min(1, 'Phone là bắt buộc'),
        address: addressSchema,
        note: z.string().optional(),
        userId: z.string().min(1, 'Ai là người mua hàng?'),
        orderId: z.string().min(1, 'Order ID là bắt buộc')
      })
    )
    .mutation(async ({ ctx, input }) => {
      const delivery = await ctx.db.delivery.create({
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          address: {
            create: {
              ...input.address
            }
          },
          note: input.note,
          orderId: input.orderId
        },
        include: {
          address: true
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
        name: z.string().min(1, 'Name là bắt buộc'),
        email: z.string().min(1, 'Email là bắt buộc'),
        phone: z.string().min(1, 'Phone là bắt buộc'),
        address: addressSchema,
        note: z.string().optional(),
        userId: z.string().min(1, 'Ai là người mua hàng?'),
        orderId: z.string().min(1, 'Order ID là bắt buộc')
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
            id: input?.id,
            name: input.name,
            email: input.email,
            phone: input.phone,
            address: {
              update: {
                ...input.address
              }
            },
            note: input.note,
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
    })
});
