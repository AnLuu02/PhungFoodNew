import { RouterOutputs } from '~/trpc/react';

export type GetAll = RouterOutputs['Revenue']['getAll'];
export type GetDistributionProducts = RouterOutputs['Revenue']['getDistributionProducts'];
export type GetOne = RouterOutputs['Revenue']['getOne'];
export type GetOverview = RouterOutputs['Revenue']['getOverview'];
export type GetOverviewDetail = RouterOutputs['Revenue']['getOverviewDetail'];
export type GetRevenueByCategory = RouterOutputs['Revenue']['getRevenueByCategory'];
export type GetRevenueOrderStatus = RouterOutputs['Revenue']['getRevenueOrderStatus'];
export type GetTopProducts = RouterOutputs['Revenue']['getTopProducts'];
export type GetTopUsers = RouterOutputs['Revenue']['getTopUsers'];
export type GetTotalSpentInMonthByUser = RouterOutputs['Revenue']['getTotalSpentInMonthByUser'];
