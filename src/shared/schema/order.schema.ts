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
  originalTotal: z.number().default(0),
  discountAmount: z.number().default(0),
  finalTotal: z.number().default(0),
  status: z.nativeEnum(OrderStatus),
  userId: z.string({ required_error: 'Ai là người mua hàng?' }).min(1, 'Ai là người mua hàng?'),
  paymentId: z.string().optional(),
  orderItems: z.array(baseOrderItemSchema).min(1, 'Đơn hàng phải có ít nhất 1 sản phẩm.'),
  voucherIds: z.array(z.string()).default([]),
  delivery: baseDeliverySchema.omit({ orderId: true }).optional()
});

export type OrderInput = z.infer<typeof baseOrderSchema>;
export type OrderItemInput = z.infer<typeof baseOrderItemSchema>;
