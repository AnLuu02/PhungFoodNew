import type { RouterOutputs } from '~/server/types/trpc.types';

export type FindInvoice = RouterOutputs['Invoice']['find'];
export type GetOneInvoice = RouterOutputs['Invoice']['getOne'];
