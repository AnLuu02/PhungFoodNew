import { RouterOutputs } from '~/trpc/react';

export type FindUser = RouterOutputs['User']['find'];

export type GetAllUser = RouterOutputs['User']['getAll'];
export type GetFilterUser = RouterOutputs['User']['getFilter'];
export type GetNotGuestUser = RouterOutputs['User']['getNotGuest'];
export type GetOneUser = RouterOutputs['User']['getOne'];
export type GetSalerUser = RouterOutputs['User']['getSaler'];
