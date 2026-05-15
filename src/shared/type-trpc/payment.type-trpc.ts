import { RouterOutputs } from '~/trpc/react';

export type FindPayment = RouterOutputs['Payment']['find'];
export type GetAllPayment = RouterOutputs['Payment']['getAll'];
export type GetOnePayment = RouterOutputs['Payment']['getOne'];
