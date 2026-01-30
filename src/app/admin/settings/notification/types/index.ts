import { z } from 'zod';
import {
  notificationPreferenceSchema,
  notificationRecipientSchema,
  notificationSchema,
  notificationTemplateSchema
} from '~/lib/ZodSchema/schema';

export type Notification = z.infer<typeof notificationSchema>;

export type NotificationRecipient = z.infer<typeof notificationRecipientSchema>;

export type NotificationTemplate = z.infer<typeof notificationTemplateSchema>;

export type NotificationPreference = z.infer<typeof notificationPreferenceSchema>;

export type NotificationClient = Notification & {
  recipients: NotificationRecipient[] &
    Partial<{
      user: {
        id: string;
        email: string;
      };
    }>;
} & NotificationTemplate;
