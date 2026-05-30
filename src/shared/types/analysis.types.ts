export interface DateRange {
  from: Date;
  to: Date;
}

export interface AnalyticsFilters {
  dateRange: DateRange;
  comparePeriod: boolean;
  branch: string;
  category: string;
  channel: string;
}

export interface KPI {
  id: string;
  title: string;
  value: number;
  previousValue: number;
  unit: 'currency' | 'number' | 'percent' | 'rate';
  icon: string;
  sparklineData: number[];
  trend: 'up' | 'down' | 'neutral';
  statusColor: string;
}

export interface DailyMetric {
  date: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
  newCustomers: number;
  returningCustomers: number;
  profit: number;
}

export interface RevenueBreakdown {
  byCategory: { name: string; value: number }[];
  byProduct: { name: string; revenue: number; quantity: number }[];
  byBranch: { name: string; revenue: number }[];
  byHour: { hour: number; revenue: number }[];
  byWeekday: { weekday: string; revenue: number }[];
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  confidenceScore: number;
  impactLevel: 'high' | 'medium' | 'low';
  suggestedAction: string;
  metric?: number;
}

export interface Anomaly {
  id: string;
  type: string;
  severity: 'critical' | 'warning' | 'info';
  impact: string;
  description: string;
  suggestedInvestigation: string;
  timestamp?: string;
}

export interface Forecast {
  dates: string[];
  actual: (number | null)[];
  forecast: (number | null)[];
  upperBound: (number | null)[];
  lowerBound: (number | null)[];
  confidence: number;
}

export interface CustomerSegment {
  name: string;
  count: number;
  revenue: number;
  color: string;
}

export interface ProductPerformance {
  name: string;
  revenue: number;
  quantity: number;
  profit: number;
  growth: number;
  category: string;
}

export interface MenuEngineeringItem {
  name: string;
  popularity: number;
  profitability: number;
  quadrant: 'stars' | 'cashCows' | 'puzzles' | 'dogs';
}
