import { RouterOutputs } from '~/trpc/react';

export type FindMaterial = RouterOutputs['Material']['find'];
export type GetAllMaterial = RouterOutputs['Material']['getAll'];
export type GetOneMaterial = RouterOutputs['Material']['getOne'];
