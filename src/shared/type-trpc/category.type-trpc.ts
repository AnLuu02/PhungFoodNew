import { RouterOutputs } from '~/trpc/react';

export type FindCategory = RouterOutputs['Category']['find'];
export type GetAllCategory = RouterOutputs['Category']['getAll'];
