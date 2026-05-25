import { RouterOutputs } from '~/trpc/react';

export type GetAllRevenue = RouterOutputs['Revenue']['getAll'];
export type GetDistributionProductRevenue = RouterOutputs['Revenue']['getDistributionProducts'];
export type GetOneRevenue = RouterOutputs['Revenue']['getOne'];
export type GetOverviewRevenue = RouterOutputs['Revenue']['getOverview'];
export type GetOverviewDetailRevenue = RouterOutputs['Revenue']['getOverviewDetail'];
export type GetRevenueByCategory = RouterOutputs['Revenue']['getRevenueByCategory'];
export type GetRevenueOrderStatus = RouterOutputs['Revenue']['getRevenueOrderStatus'];
export type GetTopProductRevenue = RouterOutputs['Revenue']['getTopProducts'];
export type GetTopUserRevenue = RouterOutputs['Revenue']['getTopUsers'];
export type GetTotalSpentInMonthByUserRevenue = RouterOutputs['Revenue']['getTotalSpentInMonthByUser'];
