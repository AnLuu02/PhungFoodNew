import { RouterOutputs } from '~/trpc/react';

export type FindCategory = RouterOutputs['Category']['find'];

export type CategoryBasic = NonNullable<RouterOutputs['Category']['getBasic']>;
export type CategoryOnly = NonNullable<RouterOutputs['Category']['getCategoriesOnly']>;
export type CategoryWithRelationBasic = NonNullable<RouterOutputs['Category']['getCategoriesWithRelationBasic']>;
