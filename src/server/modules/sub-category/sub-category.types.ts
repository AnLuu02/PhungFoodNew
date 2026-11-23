import type { RouterOutputs } from '~/server/types/trpc.types';

export type FindSubCategory = RouterOutputs['SubCategory']['find'];
export type FindSubCategoryItem = RouterOutputs['SubCategory']['find']['subCategories'][number];

//
export type GetSubCategoriesOnly = RouterOutputs['SubCategory']['getSubCategoriesOnly'];
export type SubCategoryBasic = NonNullable<RouterOutputs['SubCategory']['getBasic']>;
