import type { RouterOutputs } from '~/server/types/trpc.types';

export type FindContact = RouterOutputs['Contact']['find'];
export type GetAllContact = RouterOutputs['Contact']['getAll'];
