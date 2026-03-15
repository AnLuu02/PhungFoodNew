import { VoucherType } from '@prisma/client';
import z from 'zod';

export const baseVoucherSchema = z
  .object({
    id: z.string().optional(),
    tag: z.string().optional(),
    name: z.string({}).min(1, 'Tên voucher không được để trống'),
    description: z.string().optional(),
    type: z.nativeEnum(VoucherType).default('FIXED'),
    code: z.string({ required_error: 'Mã khuyên mái là bắt buộc' }).min(1, 'Mã khuyên mái là bắt buộc'),
    isActive: z.boolean().default(true),
    discountValue: z.number({ required_error: 'Giá trị giảm là bắt buộc' }).min(1, 'Giá trị giảm không hợp lệ'),
    maxDiscount: z.number({ required_error: 'Giá trị tối đa là bắt buộc' }).min(0, 'Giá trị tối đa không hợp lệ'),
    minOrderPrice: z
      .number({ required_error: 'Giá trị tối thiểu là bắt buộc' })
      .min(0, 'Giá trị tối thiểu không hợp lệ'),
    quantity: z.number({ required_error: 'Số lượng là bắt buộc' }).min(1, 'Số lượng không hợp lệ'),
    quantityForUser: z.number().default(1),
    applyAll: z.boolean().default(true),
    usedQuantity: z.number({ required_error: 'Số lượng đã dùng la bắt buộc' }).min(0).default(0),
    availableQuantity: z.number({ required_error: 'Số lượng hệ thống la bắt buộc' }).min(0).default(0),
    startDate: z.date({ required_error: 'Hãy chọn ngày bắt đầu khuyến mãi' }),
    endDate: z.date({ required_error: 'Hãy chọn ngày kết thúc khuyến mãi' }),
    pointUser: z.number().default(-1).optional()
  })
  .refine(data => data.endDate > data.startDate, {
    message: 'Ngày kết thúc phải sau ngày bắt đầu',
    path: ['endDate']
  });

export type VoucherInput = z.infer<typeof baseVoucherSchema>;
