import type { RouterOutputs } from '~/server/types/trpc.types';

export type GetAllBanner = RouterOutputs['Restaurant']['getAllBanner'];
export type GetOneBanner = RouterOutputs['Restaurant']['getOneBanner'];
export type GetTheme = RouterOutputs['Restaurant']['getTheme'];

export type RestaurantBase = RouterOutputs['Restaurant']['getBaseActiveClient'];
export type RestaurantDetail = RouterOutputs['Restaurant']['getBaseActiveAdmin'];
