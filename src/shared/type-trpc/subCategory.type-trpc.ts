import { RouterOutputs } from '~/trpc/react';

export type FindSubCategory = RouterOutputs['SubCategory']['find'];
export type FindSubCategoryItem = RouterOutputs['SubCategory']['find']['subCategories'][number];

export type GetAllSubCategory = RouterOutputs['SubCategory']['getAll'];
export type GetOneSubCategory = RouterOutputs['SubCategory']['getOne'];
