import { RouterOutputs } from '~/trpc/react';

export type OrderCreateOutput = RouterOutputs['Order']['create'];
export type OrderUpdateOutput = RouterOutputs['Order']['update'];
export type OrderDeleteOutput = RouterOutputs['Order']['delete'];
export type OrderGetOneOutput = RouterOutputs['Order']['getOne'];
export type OrderFindOutput = RouterOutputs['Order']['find'];
export type OrderGetFilterOutput = RouterOutputs['Order']['getFilter'];
export type OrderGetAllOutput = RouterOutputs['Order']['getAll'];
