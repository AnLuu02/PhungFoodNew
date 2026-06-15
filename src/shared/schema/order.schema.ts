import { OrderStatus } from '@prisma/client';
import z from 'zod';
import { baseDeliverySchema } from './delivery.schema';

export const baseOrderItemSchema = z.object({
  id: z.string().optional(),
  productId: z.string({ required_error: 'Product ID là bắt buộc' }).min(1, 'Product ID là bắt buộc'),
  orderId: z.string().optional(),
  quantity: z.coerce.number({ required_error: 'Số lượng là bắt buộc' }).min(1, 'Số lượng phải ít nhất là 1'),
  note: z.string().optional(),
  price: z
    .number({ required_error: 'Giá trị phải lớn hơn hoặc bằng 1.000' })
    .min(1000, 'Giá trị phải lớn hơn hoặc bằng 1.000')
    .default(1000)
});

export const baseOrderSchema = z.object({
  id: z.string().optional(),
  originalAmount: z.number().default(0),
  discountAmount: z.number().default(0),
  taxAmount: z.number().default(0),
  finalAmount: z.number().default(0),
  shippingAmount: z.number().default(0),
  status: z.nativeEnum(OrderStatus),
  userId: z.string({ required_error: 'Ai là người mua hàng?' }).min(1, 'Ai là người mua hàng?'),
  paymentId: z.string().optional(),
  orderItems: z.array(baseOrderItemSchema).min(1, 'Đơn hàng phải có ít nhất 1 sản phẩm.'),
  vouchers: z
    .array(
      z.object({
        voucherId: z.string(),
        discountAmount: z.number().default(0)
      })
    )
    .default([]),
  delivery: baseDeliverySchema.omit({ orderId: true }).optional(),
  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish()
});

export type OrderInput = z.infer<typeof baseOrderSchema>;
export type OrderItemInput = z.infer<typeof baseOrderItemSchema>;
