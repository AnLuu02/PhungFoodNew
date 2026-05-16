import { RouterOutputs } from '~/trpc/react';

export type GetAllNotification = RouterOutputs['Notification']['getAll'];
export type GetByIdNotification = RouterOutputs['Notification']['getById'];
export type GetByUserNotification = RouterOutputs['Notification']['getByUser'];
export type GetFilterNotification = RouterOutputs['Notification']['getFilter'];
