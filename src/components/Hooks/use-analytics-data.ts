'use client';
import { useMemo, useState } from 'react';
import dayjs from '~/lib/dayjs';
import {
  anomalies,
  businessInsights,
  customerSegments,
  dailyData,
  menuEngineeringMatrix,
  operationalMetrics,
  revenueBreakdown,
  revenueForecast,
  systemHealth,
  topProducts
} from '~/shared/constants/analysis.constants';
import { AnalyticsFilters, DateRange, KPI } from '~/shared/types/analysis.types';

const defaultDateRange: DateRange = {
  from: dayjs().subtract(30, 'day').toDate(),
  to: dayjs().toDate()
};
export const useAnalyticsData = () => {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    dateRange: defaultDateRange,
    comparePeriod: false,
    branch: 'all',
    category: 'all',
    channel: 'all'
  });

  const filteredDailyData = useMemo(() => {
    return dailyData.filter(item => {
      const itemDate = dayjs(item.date);
      return itemDate.isBetween(filters.dateRange.from, filters.dateRange.to, 'day', '[]');
    });
  }, [filters.dateRange]);

  const previousPeriodData = useMemo(() => {
    if (!filters.comparePeriod) return [];
    const duration = filters.dateRange.to.getTime() - filters.dateRange.from.getTime();
    const prevStart = new Date(filters.dateRange.from.getTime() - duration);
    const prevEnd = new Date(filters.dateRange.to.getTime() - duration);
    return dailyData.filter(item => {
      const itemDate = dayjs(item.date);
      return itemDate.isBetween(prevStart, prevEnd, 'day', '[]');
    });
  }, [filters.comparePeriod, filters.dateRange]);

  const kpiData = useMemo((): KPI[] => {
    const currentTotalRevenue = filteredDailyData.reduce((sum, d) => sum + d.revenue, 0);
    const currentTotalProfit = filteredDailyData.reduce((sum, d) => sum + d.profit, 0);
    const currentTotalOrders = filteredDailyData.reduce((sum, d) => sum + d.orders, 0);
    const currentAvgOrderValue = currentTotalRevenue / currentTotalOrders || 0;
    const currentNewCustomers = filteredDailyData.reduce((sum, d) => sum + d.newCustomers, 0);
    const currentReturning = filteredDailyData.reduce((sum, d) => sum + d.returningCustomers, 0);
    const retentionRate = currentTotalOrders > 0 ? (currentReturning / currentTotalOrders) * 100 : 0;
    const conversionRate = 68.5;

    let previousRevenue = 0,
      previousProfit = 0,
      previousOrders = 0,
      previousAOV = 0,
      previousNew = 0,
      previousRetention = 0;

    if (previousPeriodData.length > 0) {
      previousRevenue = previousPeriodData.reduce((sum, d) => sum + d.revenue, 0);
      previousProfit = previousPeriodData.reduce((sum, d) => sum + d.profit, 0);
      previousOrders = previousPeriodData.reduce((sum, d) => sum + d.orders, 0);
      previousAOV = previousRevenue / previousOrders;
      previousNew = previousPeriodData.reduce((sum, d) => sum + d.newCustomers, 0);
      const prevReturning = previousPeriodData.reduce((sum, d) => sum + d.returningCustomers, 0);
      previousRetention = previousOrders > 0 ? (prevReturning / previousOrders) * 100 : 0;
    }

    const sparklineData = filteredDailyData.slice(-14).map(d => d.revenue);

    return [
      {
        id: 'revenue',
        title: 'Tổng doanh thu',
        value: currentTotalRevenue,
        previousValue: previousRevenue,
        unit: 'currency',
        icon: 'CurrencyDollar',
        sparklineData,
        trend: currentTotalRevenue > previousRevenue ? 'up' : 'down',
        statusColor: 'green'
      },
      {
        id: 'profit',
        title: 'Lợi nhuận ròng',
        value: currentTotalProfit,
        previousValue: previousProfit,
        unit: 'currency',
        icon: 'ChartBar',
        sparklineData: filteredDailyData.slice(-14).map(d => d.profit),
        trend: currentTotalProfit > previousProfit ? 'up' : 'down',
        statusColor: 'green'
      },
      {
        id: 'orders',
        title: 'Tổng số đơn đặt hàng',
        value: currentTotalOrders,
        previousValue: previousOrders,
        unit: 'number',
        icon: 'ShoppingBag',
        sparklineData: filteredDailyData.slice(-14).map(d => d.orders),
        trend: currentTotalOrders > previousOrders ? 'up' : 'down',
        statusColor: 'blue'
      },
      {
        id: 'aov',
        title: 'Giá trị đặt hàng trung bình',
        value: currentAvgOrderValue,
        previousValue: previousAOV,
        unit: 'currency',
        icon: 'Receipt',
        sparklineData: filteredDailyData.slice(-14).map(d => d.avgOrderValue),
        trend: currentAvgOrderValue > previousAOV ? 'up' : 'down',
        statusColor: 'indigo'
      },
      {
        id: 'retention',
        title: 'Giữ chân khách hàng',
        value: retentionRate,
        previousValue: previousRetention,
        unit: 'percent',
        icon: 'Users',
        sparklineData: [],
        trend: retentionRate > previousRetention ? 'up' : 'down',
        statusColor: 'teal'
      },
      {
        id: 'newCustomers',
        title: 'Khách hàng mới',
        value: currentNewCustomers,
        previousValue: previousNew,
        unit: 'number',
        icon: 'UserPlus',
        sparklineData: filteredDailyData.slice(-14).map(d => d.newCustomers),
        trend: currentNewCustomers > previousNew ? 'up' : 'down',
        statusColor: 'cyan'
      },
      {
        id: 'returning',
        title: 'Khách hàng quay lại',
        value: currentReturning,
        previousValue: previousPeriodData.reduce((sum, d) => sum + d.returningCustomers, 0),
        unit: 'number',
        icon: 'UserCheck',
        sparklineData: filteredDailyData.slice(-14).map(d => d.returningCustomers),
        trend: 'up',
        statusColor: 'orange'
      },
      {
        id: 'conversion',
        title: 'Tỷ lệ chuyển đổi',
        value: conversionRate,
        previousValue: 65.2,
        unit: 'percent',
        icon: 'TrendingUp',
        sparklineData: [65.2, 66.1, 67.4, 68.0, 68.5],
        trend: 'up',
        statusColor: 'pink'
      }
    ];
  }, [filteredDailyData, previousPeriodData]);

  return {
    filters,
    setFilters,
    filteredDailyData,
    previousPeriodData,
    kpiData,
    revenueBreakdown,
    businessInsights,
    anomalies,
    revenueForecast,
    orderForecast: revenueForecast,
    customerSegments,
    topProducts,
    menuEngineeringMatrix,
    operationalMetrics,
    systemHealth,
    isLoading: false,
    error: null
  };
};
