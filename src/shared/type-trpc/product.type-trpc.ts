import { RouterOutputs } from '~/trpc/react';

export type FindProduct = RouterOutputs['Product']['find'];
export type GetAllProduct = RouterOutputs['Product']['getAll'];
export type GetOneProduct = RouterOutputs['Product']['getOne'];
export type FindInfiniteProduct = RouterOutputs['Product']['findInfiniteProduct'];
