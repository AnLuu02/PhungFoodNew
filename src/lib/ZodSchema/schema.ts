import {
  NotificationChannel,
  NotificationPriority,
  NotificationRecipientStatus,
  NotificationStatus,
  NotificationType,
  OrderStatus,
  RecipientType
} from '@prisma/client';
import { z } from 'zod';
import { baseDeliverySchema } from '~/shared/schema/delivery.schema';

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string({ required_error: 'Tên sản phẩm là bắt buộc' }).min(1, 'Tên sản phẩm không được để trống'),
  description: z.string().optional(),
  descriptionDetailJson: z.any().optional().nullable(),
  descriptionDetailHtml: z.string().default('<p>Đang cập nhật</p>'),
  region: z.string({ required_error: 'Món ăn này là của miền nào đây?' }).min(1, 'Món ăn này là của miền nào đây?'),
  tag: z.string().optional(),
  tags: z.array(z.string()),
  isActive: z.boolean().default(true),
  price: z
    .number({ required_error: 'Giá trị phải lớn hơn hoặc bằng 10.000' })
    .min(10000, 'Giá trị phải lớn hơn hoặc bằng 10.000')
    .default(10000),
  discount: z
    .number({ required_error: 'Giá trị khuyên mái phải lớn hơn hoặc bằng 0' })
    .min(0, 'Giá trị không được nhỏ hơn 0')
    .optional()
    .default(0),
  thumbnail: z.instanceof(File).optional(),
  gallery: z.array(z.instanceof(File)).optional(),
  subCategoryId: z.string({ required_error: 'Hãy chọn danh mục sản phẩm' }).min(1, 'Hãy chọn danh mục sản phẩm'),
  rating: z.number().optional(),
  totalRating: z.number().optional(),
  soldQuantity: z.coerce.number().min(0, 'Số lượng đã bán không được âm'),
  availableQuantity: z.coerce.number().min(0, 'Số lượng khả dụng không được âm'),
  materials: z.array(z.string()).optional()
});

//

export const orderItemSchema = z.object({
  id: z.string().optional(),
  productId: z.string({ required_error: 'Product ID là bắt buộc' }).min(1, 'Product ID là bắt buộc'),
  quantity: z.coerce.number({ required_error: 'Số lượng là bắt buộc' }).min(1, 'Số lượng phải ít nhất là 1'),
  price: z
    .number({ required_error: 'Giá trị phải lớn hơn hoặc bằng 1.000' })
    .min(1000, 'Giá trị phải lớn hơn hoặc bằng 1.000')
    .default(1000)
});

export const orderSchema = z.object({
  id: z.string().optional(),
  originalTotal: z.number().default(0),
  discountAmount: z.number().default(0),
  finalTotal: z.number().default(0),
  status: z.nativeEnum(OrderStatus),
  userId: z.string({ required_error: 'Ai là người mua hàng?' }).min(1, 'Ai là người mua hàng?'),
  paymentId: z.string({ required_error: 'Chọn phương thức thanh toán' }).min(1, 'Chọn phương thức thanh toán'),
  orderItems: z.array(orderItemSchema),
  delivery: baseDeliverySchema.omit({ orderId: true })
});

export const notificationTemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string({ required_error: 'Tên template là bắt buộc' }).min(1, 'Tên template không được để trống'),
  title: z.string({ required_error: 'Tiêu đề là bắt buộc' }),
  message: z.string({ required_error: 'Nội dung là bắt buộc' }),
  type: z.nativeEnum(NotificationType),
  category: z.string({ required_error: 'Danh mục là bắt buộc' }),
  variables: z.array(z.string()).default([]),
  createdAt: z.date().default(() => new Date())
});
export const notificationSchema = z.object({
  id: z.string().optional(),
  title: z.string({ required_error: 'Tiêu đề thông báo là bắt buộc' }).min(1, 'Tiêu đề không được để trống'),
  message: z.string({ required_error: 'Nội dung thông báo là bắt buộc' }).min(1, 'Nội dung không được để trống'),

  type: z.nativeEnum(NotificationType),
  recipient: z.nativeEnum(RecipientType),

  userIds: z.array(z.string()).optional().default([]),
  variables: z.object({}).optional().default({}),

  status: z.nativeEnum(NotificationStatus).default(NotificationStatus.sent),
  priority: z.nativeEnum(NotificationPriority),
  channels: z.array(z.nativeEnum(NotificationChannel)).default([]),

  scheduledAt: z.date().optional(),
  createdAt: z.date().default(() => new Date()),

  template: notificationTemplateSchema.optional(),
  templateId: z.string().optional(),

  tags: z.array(z.string()).default([]),

  analytics: z
    .object({
      sent: z.number().default(0),
      delivered: z.number().default(0),
      read: z.number().default(0),
      clicked: z.number().default(0)
    })
    .default({ sent: 0, delivered: 0, read: 0, clicked: 0 })
});

export const notificationRecipientSchema = z.object({
  id: z.string().optional(),
  notificationId: z.string({ required_error: 'Thiếu ID thông báo' }),
  userId: z.string({ required_error: 'Thiếu ID người nhận' }),

  status: z.nativeEnum(NotificationRecipientStatus).default('PENDING'),

  sentAt: z.date().optional(),
  deliveredAt: z.date().optional(),
  readAt: z.date().optional(),
  clickedAt: z.date().optional()
});

export const notificationPreferenceSchema = z.object({
  id: z.string().optional(),
  userId: z.string({ required_error: 'userId là bắt buộc' }),
  email: z.boolean().default(true),
  sms: z.boolean().default(false),
  push: z.boolean().default(true),
  inApp: z.boolean().default(true),
  categories: z
    .object({
      orders: z.boolean().default(true),
      promotions: z.boolean().default(true),
      system: z.boolean().default(true),
      general: z.boolean().default(true)
    })
    .default({
      orders: true,
      promotions: true,
      system: true,
      general: true
    }),
  quietHours: z
    .object({
      enabled: z.boolean().default(false),
      start: z.string().default('22:00'),
      end: z.string().default('07:00')
    })
    .default({ enabled: false, start: '22:00', end: '07:00' }),
  updatedAt: z.date().default(() => new Date())
});
