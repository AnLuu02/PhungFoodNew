import { RouterOutputs } from '~/trpc/react';

export type TFindOrder = RouterOutputs['Order']['find'];
export type TGetAllOrder = RouterOutputs['Order']['getAll'];
export type TGetFilterOrder = RouterOutputs['Order']['getFilter'];
export type TGetOneOrder = RouterOutputs['Order']['getOne'];
