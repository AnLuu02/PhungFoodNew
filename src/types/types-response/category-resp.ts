import { RouterOutputs } from '~/trpc/react';

export type CategoryCreateOutput = RouterOutputs['Category']['create'];
export type CategoryUpdateOutput = RouterOutputs['Category']['update'];
export type CategoryDeleteOutput = RouterOutputs['Category']['delete'];
export type CategoryGetOneOutput = RouterOutputs['Category']['getOne'];
export type CategoryFindOutput = RouterOutputs['Category']['find'];
export type CategoryGetFilterOutput = RouterOutputs['Category']['getFilter'];
export type CategoryGetAllOutput = RouterOutputs['Category']['getAll'];

export type CategoryCreateManyOutput = RouterOutputs['Category']['createMany'];
