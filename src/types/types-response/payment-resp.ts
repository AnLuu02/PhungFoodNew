import { RouterOutputs } from '~/trpc/react';

export type PaymentCreateOutput = RouterOutputs['Payment']['create'];
export type PaymentUpdateOutput = RouterOutputs['Payment']['update'];
export type PaymentDeleteOutput = RouterOutputs['Payment']['delete'];
export type PaymentGetOneOutput = RouterOutputs['Payment']['getOne'];
export type PaymentFindOutput = RouterOutputs['Payment']['find'];
export type PaymentGetAllOutput = RouterOutputs['Payment']['getAll'];
