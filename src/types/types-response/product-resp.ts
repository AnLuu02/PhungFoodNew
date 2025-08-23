import { RouterOutputs } from '~/trpc/react';

export type ProductCreateOutput = RouterOutputs['Product']['create'];
export type ProductUpdateOutput = RouterOutputs['Product']['update'];
export type ProductDeleteOutput = RouterOutputs['Product']['delete'];
export type ProductGetOneOutput = RouterOutputs['Product']['getOne'];
export type ProductFindOutput = RouterOutputs['Product']['find'];
export type ProductGetFilterOutput = RouterOutputs['Product']['getFilter'];
export type ProductGetAllOutput = RouterOutputs['Product']['getAll'];
export type ProductGetTotalProductSalesOutput = RouterOutputs['Product']['getTotalProductSales'];
export type ProductGetProductBestSalerByQuarterOutput = RouterOutputs['Product']['getProductBestSalerByQuarter'];
