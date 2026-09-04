import { RouterOutputs } from '~/trpc/react';

export type TGetAllBanner = RouterOutputs['Restaurant']['getAllBanner'];
export type GetOneBanner = RouterOutputs['Restaurant']['getOneBanner'];
export type TGetTheme = RouterOutputs['Restaurant']['getTheme'];

export type RestaurantBase = RouterOutputs['Restaurant']['getBaseActiveClient'];
export type RestaurantDetail = RouterOutputs['Restaurant']['getBaseActiveAdmin'];
