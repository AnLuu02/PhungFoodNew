import { RouterOutputs } from '~/trpc/react';
import { UserRole } from '../constants/user.constants';

export type FindUser = RouterOutputs['User']['find'];

export type GetAllUser = RouterOutputs['User']['getAll'];
export type GetFilterUser = RouterOutputs['User']['getFilter'];
export type GetNotGuestUser = RouterOutputs['User']['getNotGuest'];
export type GetOneUser = RouterOutputs['User']['getOne'];
export type GetSalerUser = RouterOutputs['User']['getSaler'];
export type GetOverviewUser = RouterOutputs['User']['getOverviewUser'];

export type TUserRole = (typeof UserRole)[keyof typeof UserRole];
