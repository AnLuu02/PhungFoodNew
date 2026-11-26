import type { RouterOutputs } from '~/server/types/trpc.types';

export type FindOrder = RouterOutputs['Order']['find'];
export type GetFilterOrder = NonNullable<RouterOutputs['Order']['getFilter']>;
export type GetFilterOrderItem = GetFilterOrder[number]['orderItems'][number];
export type GetOneOrder = RouterOutputs['Order']['getOne'];
