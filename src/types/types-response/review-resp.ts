import { RouterOutputs } from '~/trpc/react';

export type ReviewFindOutput = RouterOutputs['Review']['find'];
export type ReviewCreateOutput = RouterOutputs['Review']['create'];
export type ReviewUpdateOutput = RouterOutputs['Review']['update'];
export type ReviewDeleteOutput = RouterOutputs['Review']['delete'];
export type ReviewGetFilterOutput = RouterOutputs['Review']['getFilter'];
export type ReviewGetAllOutput = RouterOutputs['Review']['getAll'];
