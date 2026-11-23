import type { RouterOutputs } from '~/server/types/trpc.types';

export type FindPayment = RouterOutputs['Payment']['find'];
export type GetAllPayment = RouterOutputs['Payment']['getAll'];
export type GetOnePayment = RouterOutputs['Payment']['getOne'];
