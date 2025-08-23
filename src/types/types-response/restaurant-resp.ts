import { RouterOutputs } from '~/trpc/react';

export type RestaurantCreateOutput = RouterOutputs['Restaurant']['create'];
export type RestaurantUpdateOutput = RouterOutputs['Restaurant']['update'];
export type RestaurantGetOneOutput = RouterOutputs['Restaurant']['getOne'];
export type RestaurantGetOneBannerOutput = RouterOutputs['Restaurant']['getOneBanner'];
export type RestaurantCreateBannerOutput = RouterOutputs['Restaurant']['createBanner'];
export type RestaurantUpdateBannerOutput = RouterOutputs['Restaurant']['updateBanner'];
