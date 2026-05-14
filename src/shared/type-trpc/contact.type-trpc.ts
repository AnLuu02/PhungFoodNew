import { RouterOutputs } from '~/trpc/react';

export type FindContact = RouterOutputs['Contact']['find'];
export type GetAllContact = RouterOutputs['Contact']['getAll'];
