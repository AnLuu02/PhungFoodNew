import { InvoiceStatus } from '@prisma/client';
import z from 'zod';

export const baseInvoiceSchema = z.object({
  id: z.string().nullable().optional(),
  invoiceNumber: z.string({ required_error: 'Số hóa đơn là bắt buộc' }).min(1, 'Số hóa đơn không hợp lệ'),
  status: z.nativeEnum(InvoiceStatus).default(InvoiceStatus.DRAFT),
  orderId: z.string({ required_error: 'Mã đơn hàng là bắt buộc' }).min(1, 'Mã đơn hàng không hợp lệ'),
  sellerId: z.string({ required_error: 'Người lập hóa đơn không được để trống' }).min(1, 'ID người bán không hợp lệ'),
  customerId: z.string().nullable().nullable(),
  buyerName: z.string({ required_error: 'Tên bên mua là bắt buộc' }).min(1, 'Tên bên mua không được để trống'),
  buyerEmail: z.string().email('Email không đúng định dạng').nullable().nullable().or(z.literal('')),
  buyerPhone: z
    .string()
    .regex(/^\d{10}$/, 'Số điện thoại phải có 10 chữ số')
    .nullable(),
  buyerAddress: z.string().nullable(),
  buyerTaxCode: z.string().nullable(),
  subTotal: z.number().min(0, 'Giá trị không được âm').default(0),
  taxAmount: z.number().min(0).default(0),
  discountAmount: z.number().min(0).default(0),
  totalAmount: z.number().min(0).default(0),
  currency: z.string().default('VND'),
  paymentMethod: z.string().nullable().default('VNPAY'),
  pdfUrl: z.string().url('Link PDF không hợp lệ').nullable().or(z.literal('')).optional(),
  note: z.string().nullable(),
  issuedAt: z.coerce.date().default(() => new Date()),
  paidAt: z.coerce.date().nullable().nullable(),
  dueDate: z.coerce.date().nullable().nullable()
});
export type InvoiceInput = z.infer<typeof baseInvoiceSchema>;
