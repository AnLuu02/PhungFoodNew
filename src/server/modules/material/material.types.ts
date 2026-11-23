import type { RouterOutputs } from '~/server/types/trpc.types';

export type FindMaterial = RouterOutputs['Material']['find'];
export type GetAllMaterial = RouterOutputs['Material']['getAll'];
export type GetOneMaterial = RouterOutputs['Material']['getOne'];
