import { RouterOutputs } from '~/trpc/react';

export type FindCategory = RouterOutputs['Category']['find'];
export type FindCategoryItem = RouterOutputs['Category']['find']['categories'][number];

export type GetAllCategory = RouterOutputs['Category']['getAll'];
