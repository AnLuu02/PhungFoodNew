import { Prisma } from '@prisma/client';
import dayjs from '~/lib/dayjs';
import { periodComparisonMap } from '~/shared/constants/statistics.constants';
import {
  AggregateFn,
  ChangeRateObj,
  CompareOptions,
  CompareReturn,
  FormatDateViVNOptions,
  Period,
  RawQuery
} from '~/shared/types';

export const getDatesObjBetween = (
  startDate: Date | number,
  endDate: Date | number,
  options?: FormatDateViVNOptions
) => {
  const start = options?.timezone ? dayjs(startDate).tz() : dayjs(startDate).utc();
  const end = options?.timezone ? dayjs(endDate).tz() : dayjs(endDate).utc();
  const diffDays = end.diff(start, 'day');
  const datesObj: Record<string, number> = {};

  for (let i = 0; i <= diffDays; i++) {
    const dateStr = start.add(i, 'day').format(options?.format ?? 'YYYY-MM-DD');
    datesObj[dateStr] = 0;
  }

  return datesObj;
};

export function buildChangeRateData(changeRate: number, period: Period): ChangeRateObj {
  const isIncrease = changeRate > 0;

  return {
    value: Math.abs(changeRate),
    isIncrease,
    color: isIncrease ? 'green' : changeRate === 0 ? 'gray' : 'red',
    label: periodComparisonMap[period],
    message:
      changeRate === 0
        ? `Không có thay đổi`
        : `${isIncrease ? 'Tăng' : 'Giảm'} ${Math.abs(changeRate).toFixed(0)}% ${periodComparisonMap[period]}`
  };
}

export const buildAggregate = (fn: AggregateFn, field?: string) => {
  switch (fn) {
    case 'COUNT':
      return 'COUNT(*)::int';

    case 'SUM':
      return `SUM("${field}")::float`;

    case 'AVG':
      return `AVG("${field}")::float`;

    default:
      throw new Error('Invalid aggregate');
  }
};

export function getChangeRateMessage(changeRate: number, period: Period) {
  const comparisonText = periodComparisonMap[period];

  if (changeRate === 0) {
    return `Không thay đổi ${comparisonText}`;
  }

  const isIncrease = changeRate > 0;

  return `
    ${isIncrease ? 'Tăng' : 'Giảm'} 
    ${Math.abs(changeRate)}% 
    ${comparisonText}
  `
    .replace(/\s+/g, ' ')
    .trim();
}

export const buildRawQuery = async ({
  db,
  model,
  field = '*',
  aggregateFn = 'COUNT',
  startDate,
  endDate,
  previousEndDate,
  previousStartDate
}: CompareOptions & { previousEndDate: Date; previousStartDate: Date }) => {
  const result = await db.$queryRaw<RawQuery[]>(
    Prisma.sql`
    SELECT 
      DATE("createdAt") as date,
      ${Prisma.raw(buildAggregate(aggregateFn, field))} as total
    FROM ${Prisma.raw(`"${model}"`)}
    WHERE DATE("createdAt") >= ${previousStartDate}
      AND DATE("createdAt") <= ${endDate}
    GROUP BY DATE("createdAt")
    ORDER BY date DESC
  `
  );

  if (!startDate || !endDate || !result || result?.length === 0)
    return {
      currentData: [],
      previousData: []
    };
  const objRangePreviousDates = getDatesObjBetween(previousStartDate, previousEndDate);
  const objRangeCurrentDates = getDatesObjBetween(startDate, endDate);

  result.forEach(item => {
    const key = dayjs(item.date).format('YYYY-MM-DD');
    if (key in objRangeCurrentDates) {
      objRangeCurrentDates[key] = item.total;
    }
    if (key in objRangePreviousDates) {
      objRangePreviousDates[key] = item.total;
    }
  });
  const currentData = Object.entries(objRangeCurrentDates).map(
    ([dateKey, valueTotal]: [dateKey: string, valueTotal: number]) => {
      return { date: dayjs(dateKey).utc().toDate(), total: valueTotal };
    }
  );
  const previousData = Object.entries(objRangePreviousDates).map(
    ([dateKey, valueTotal]: [dateKey: string, valueTotal: number]) => {
      return { date: dayjs(dateKey).utc().toDate(), total: valueTotal };
    }
  );
  return {
    currentData,
    previousData
  };
};

export const calcChangeRate = async ({
  period,
  db,
  model,
  field = '*',
  aggregateFn = 'COUNT',
  startDate,
  endDate,
  previousEndDate,
  previousStartDate
}: CompareOptions & {
  startDate: Date;
  endDate: Date;
  previousEndDate: Date;
  previousStartDate: Date;
}): Promise<CompareReturn> => {
  const result = await buildRawQuery({
    db,
    model,
    field,
    aggregateFn,
    startDate,
    endDate,
    previousEndDate,
    previousStartDate,
    period
  });
  const currentValue =
    (result.currentData && result.currentData.reduce((sum: number, item) => (sum += item.total), 0)) || 0;
  const previousValue =
    (result.previousData && result.previousData.reduce((sum: number, item) => (sum += item.total), 0)) || 0;

  const currentSparkline = result.currentData.map(d => d.total).filter(i => i !== undefined);
  const previousSparkline = result.previousData.map(d => d.total).filter(i => i !== undefined);

  return {
    changeRate: ((currentValue - previousValue) / (previousValue === 0 ? 1 : previousValue)) * 100,
    current: {
      value: currentValue,
      currentData: result.currentData,
      startDate,
      endDate,
      sparkline: currentSparkline.length <= 0 ? [0, 0, 0, 0, 0, 0, 0] : currentSparkline
    },
    previous: {
      value: previousValue,
      previousData: result.previousData,
      startDate: previousStartDate,
      endDate: previousEndDate,
      sparkline: previousSparkline.length <= 0 ? [0, 0, 0, 0, 0, 0, 0] : previousSparkline
    }
  };
};
