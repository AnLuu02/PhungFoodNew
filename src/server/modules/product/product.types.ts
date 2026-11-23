import type { RouterOutputs } from '~/server/types/trpc.types';

export type FindProduct = RouterOutputs['Product']['find'];
export type getProductsOnly = RouterOutputs['Product']['getProductsOnly'];
export type FindInfiniteProduct = RouterOutputs['Product']['findInfiniteProduct'];

//
export type ProductBase = RouterOutputs['Product']['getBase'];
