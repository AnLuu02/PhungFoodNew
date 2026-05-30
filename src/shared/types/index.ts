import { Prisma, PrismaClient } from '@prisma/client';

export type AggregateFn = 'COUNT' | 'SUM' | 'AVG';

export type Period = '_today' | '7_day' | '15_day' | '1_month' | '3_month' | '6_month' | '1_year' | '_all' | '_custom';
export type RawQuery = {
  date: Date;
  total: number;
};
export type CompareOptions = {
  period: Period;
  db: PrismaClient;
  model: Prisma.ModelName;
  field?: string;
  aggregateFn?: AggregateFn;
  startDate?: Date;
  endDate?: Date;
};

export type CompareReturn = {
  current: {
    value: number;
    startDate: Date;
    endDate: Date;
    currentData: RawQuery[];
    sparkline: number[];
  };
  previous: {
    value: number;
    startDate: Date;
    endDate: Date;
    previousData: RawQuery[];
    sparkline: number[];
  };
  changeRate: number;
};

export type ChangeRateObj = {
  value: number;
  isIncrease: boolean;
  color: 'green' | 'red' | 'gray';
  label: string;
  message: string;
};
export type FormatDateViVNOptions = {
  hour?: boolean;
  format?: string;
  fallback?: string;
  defaultTimeZone?: boolean;
  timezone?: string;
};
