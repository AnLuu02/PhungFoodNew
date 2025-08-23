import { RouterOutputs } from '~/trpc/react';

export type NotificationCreateOutput = RouterOutputs['Notification']['create'];
export type NotificationUpdateOutput = RouterOutputs['Notification']['update'];
export type NotificationDeleteOutput = RouterOutputs['Notification']['delete'];
export type NotificationGetOneOutput = RouterOutputs['Notification']['getOne'];
export type NotificationFindOutput = RouterOutputs['Notification']['find'];
export type NotificationGetFilterOutput = RouterOutputs['Notification']['getFilter'];
export type NotificationDeleteFilterOutput = RouterOutputs['Notification']['deleteFilter'];
