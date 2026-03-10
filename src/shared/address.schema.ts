import { AddressType } from '@prisma/client';
import z from 'zod';

export const baseAddressSchema = z.object({
  id: z.string().optional().nullable(),
  type: z.nativeEnum(AddressType).default(AddressType.USER),
  provinceId: z.string().optional().nullable(),
  districtId: z.string().optional().nullable(),
  wardId: z.string().optional().nullable(),
  province: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  ward: z.string().optional().nullable(),
  detail: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable().or(z.literal('')),
  fullAddress: z.string().optional().nullable()
});

export const deliveryAddressSchema = baseAddressSchema.extend({
  provinceId: z.string({ required_error: 'Tỉnh/thành phố là bắt buộc' }).min(1, 'Tỉnh/thành phố là bắt buộc'),
  districtId: z.string({ required_error: 'Quận/huyện là bắt buộc' }).min(1, 'Quận/huyện là bắt buộc'),
  wardId: z.string({ required_error: 'Phường/xã là bắt buộc' }).min(1, 'Phường/xã là bắt buộc'),
  detail: z
    .string({ required_error: 'Chi tiết địa chỉ không được để trống' })
    .min(1, 'Chi tiết địa chỉ không được để trống')
});
