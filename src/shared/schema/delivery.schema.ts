import z from 'zod';
import { deliveryAddressSchema } from './address.schema';

export const baseDeliverySchema = z.object({
  id: z.string().optional(),
  name: z.string({ required_error: 'Tên người nhận là bắt buộc' }).min(1, 'Tên người nhận là bắt buộc'),
  email: z.string({ required_error: 'Email là bắt buộc' }).email({ message: 'Email không hợp lệ' }),
  phone: z.string({ required_error: 'Số điện thoại là bắt buộc' }).regex(/^\d{10}$/, 'Số điện thoại phải có 10 chữ số'),
  address: deliveryAddressSchema.optional(),
  note: z.string().optional(),
  orderId: z.string()
});

export type DeliveryInput = z.infer<typeof baseDeliverySchema>;
