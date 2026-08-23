import { RouterOutputs } from '~/trpc/react';

export type FindReview = RouterOutputs['Review']['find'];
export type GetReviewForOwner = RouterOutputs['Review']['getForOwner'];
