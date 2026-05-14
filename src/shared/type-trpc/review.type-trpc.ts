import { RouterOutputs } from '~/trpc/react';

export type FindReview = RouterOutputs['Review']['find'];
export type GetAllReview = RouterOutputs['Review']['getAll'];
export type GetOneReview = RouterOutputs['Review']['getOne'];
export type GetFilterReview = RouterOutputs['Review']['getFilter'];
