import type { RouterOutputs } from '~/server/types/trpc.types';

export type GetAllNotification = RouterOutputs['Notification']['getAll'];
export type NotificationBase = NonNullable<RouterOutputs['Notification']['getBase']>;

//template
export type NotificationTemplateBase = NonNullable<RouterOutputs['NotificationTemplate']['getTemplatesBase']>[number];
