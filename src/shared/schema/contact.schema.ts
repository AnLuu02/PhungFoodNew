import { TypeContact } from '@prisma/client';
import z from 'zod';

export const baseContactSchema = z.object({
  id: z.string().optional(),
  fullName: z.string({ required_error: 'Tên người dùng là bắt buộc' }).min(1, 'Tên không được để trống'),
  email: z.string({ required_error: 'Email là bắt buộc' }).email({ message: 'Email không hợp lệ' }),
  phone: z.string({ required_error: 'Số điện thoại là bắt buộc' }).regex(/^\d{10}$/, 'Số điện thoại phải có 10 chữ số'),
  message: z.string({ required_error: 'Nội dung là bắt buộc' }).min(1, 'Nội dung không được để trống'),
  responded: z.boolean().default(false),
  subject: z.string().optional().nullable(),
  type: z.nativeEnum(TypeContact)
});

export type ContactInput = z.infer<typeof baseContactSchema>;
