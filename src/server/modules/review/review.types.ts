import type { RouterOutputs } from '~/server/types/trpc.types';

export type FindReview = RouterOutputs['Review']['find'];
export type GetReviewForOwner = RouterOutputs['Review']['getForOwner'];
