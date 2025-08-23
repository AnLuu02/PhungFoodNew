import { RouterOutputs } from '~/trpc/react';

export type MaterialCreateOutput = RouterOutputs['Material']['create'];
export type MaterialUpdateOutput = RouterOutputs['Material']['update'];
export type MaterialDeleteOutput = RouterOutputs['Material']['delete'];
export type MaterialGetOneOutput = RouterOutputs['Material']['getOne'];
export type MaterialFindOutput = RouterOutputs['Material']['find'];
export type MaterialGetAllOutput = RouterOutputs['Material']['getAll'];

export type MaterialCreateManyOutput = RouterOutputs['Material']['createMany'];
