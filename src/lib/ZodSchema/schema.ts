import {
  NotificationChannel,
  NotificationPriority,
  NotificationRecipientStatus,
  NotificationStatus,
  NotificationType,
  RecipientType
} from '@prisma/client';
import { z } from 'zod';

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
