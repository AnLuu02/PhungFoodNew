import { Gender, UserLevel } from '@prisma/client';
import z from 'zod';
import { baseAddressSchema } from './address.schema';
import { imageInfoInputSchema } from './image.info.schema';

export const baseUserSchema = z.object({
  id: z.string().optional(),
  name: z.string({ required_error: 'Tên người dùng là bắt buộc' }).min(1, 'Tên người dùng là bắt buộc'),
  email: z
    .string({ required_error: 'Email là bắt buộc' })
    .email({ message: 'Email không hợp lệ (vd: example@gmail.com)' }),
  phone: z.string({ required_error: 'Số điện thoại là bắt buộc' }).regex(/^\d{10}$/, 'Số điện thoại phải có 10 chữ số'),
  isActive: z.boolean().default(true),
  gender: z.nativeEnum(Gender).default(Gender.OTHER),
  roleId: z.string().optional(),
  dateOfBirth: z.date().optional(),
  password: z
    .string({ required_error: 'Mật khẩu không được để trống.' })
    .min(6, { message: 'Tối thiểu 6 ký tự' })
    .regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])/, {
      message: 'Mật khẩu phải đủ mạnh (hoa, thường, số, đặc biệt)'
    }),
  address: baseAddressSchema.optional(),
  pointUser: z.number().default(0),
  level: z.nativeEnum(UserLevel).default(UserLevel.BRONZE)
});

export const userInputSchema = baseUserSchema.extend({
  imageForEntity: imageInfoInputSchema.optional()
});

export type UserInput = z.infer<typeof userInputSchema>;
