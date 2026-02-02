import z from 'zod';
import {
  bannerSchema,
  categorySchema,
  contactSchema,
  imageSchema,
  invoiceSchema,
  materialSchema,
  notificationRecipientSchema,
  notificationSchema,
  notificationTemplateSchema,
  orderSchema,
  paymentSchema,
  permissionSchema,
  productSchema,
  restaurantSchema,
  revenueSchema,
  reviewSchema,
  roleSchema,
  subCategorySchema,
  themeSchema,
  userSchema,
  voucherSchema
} from '~/lib/ZodSchema/schema';

export const SubCategoryClientSchema = subCategorySchema.extend({ thumbnail: imageSchema });
export const ProductClientSchema = productSchema.extend({
  thumbnail: z.instanceof(File).optional(),
  gallery: z.array(z.instanceof(File)).optional()
});
export const BannerClientSchema = bannerSchema.extend({
  banner1: z.instanceof(File).optional(),
  banner2: z.instanceof(File).optional(),
  gallery: z.array(z.instanceof(File)).default([])
});
export const UserClientSchema = userSchema.extend({ image: imageSchema });

export type CategoryClientType = z.infer<typeof categorySchema>;
export type SubCategoryClientType = z.infer<typeof SubCategoryClientSchema>;
export type PaymentClientType = z.infer<typeof paymentSchema>;
export type ProductClientType = z.infer<typeof ProductClientSchema>;
export type NotificationClientType = z.infer<typeof notificationSchema>;
export type NotificationRecipientClientType = z.infer<typeof notificationRecipientSchema>;
export type NotificationTemplateClientType = z.infer<typeof notificationTemplateSchema>;
export type NotificationClientHasUser = NotificationClientType & {
  recipients: NotificationRecipientClientType[] &
    Partial<{
      user: {
        id: string;
        email: string;
      };
    }>;
} & NotificationTemplateClientType;
export type ContextClientType = z.infer<typeof contactSchema>;
export type UserClientType = z.infer<typeof UserClientSchema>;
export type ReviewClientType = z.infer<typeof reviewSchema>;
export type VoucherClientType = z.infer<typeof voucherSchema>;
export type ThemeClientType = z.infer<typeof themeSchema>;
export type RestaurantClientType = z.infer<typeof restaurantSchema>;
export type BannerClientType = z.infer<typeof BannerClientSchema>;
export type PermissionClientType = z.infer<typeof permissionSchema>;
export type RoleClientType = z.infer<typeof roleSchema>;
export type RevenueClientType = z.infer<typeof revenueSchema>;
export type OrderClientType = z.infer<typeof orderSchema>;
export type MaterialClientType = z.infer<typeof materialSchema>;
export type InvoiceClientType = z.infer<typeof invoiceSchema>;
