import { RouterOutputs } from '~/trpc/react';

export type FindInvoice = RouterOutputs['Invoice']['find'];
export type GetAllInvoice = RouterOutputs['Invoice']['getAll'];
export type GetOneInvoice = RouterOutputs['Invoice']['getOne'];
