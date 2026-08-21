import { RouterOutputs } from '~/trpc/react';

export type FindProduct = RouterOutputs['Product']['find'];
export type getProductsOnly = RouterOutputs['Product']['getProductsOnly'];
export type FindInfiniteProduct = RouterOutputs['Product']['findInfiniteProduct'];

//
export type ProductBase = RouterOutputs['Product']['getBase'];
