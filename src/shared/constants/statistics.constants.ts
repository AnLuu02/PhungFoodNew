import dayjs from '~/lib/dayjs';
import { CompareReturn, Period } from '../types';
export const defaultValueCompareReturn: CompareReturn = {
  current: {
    value: 0,
    currentData: [],
    startDate: dayjs().utc().toDate(),
    endDate: dayjs().utc().toDate(),
    sparkline: [0, 0, 0, 0, 0, 0, 0]
  },
  previous: {
    value: 0,
    previousData: [],
    startDate: dayjs().utc().toDate(),
    endDate: dayjs().utc().toDate(),
    sparkline: [0, 0, 0, 0, 0, 0, 0]
  },
  changeRate: 0
};
export const periodComparisonMap: Record<Period, string> = {
  _today: 'so với hôm qua',
  '7_day': 'so với 7 ngày trước',
  '15_day': 'so với 15 ngày trước',
  '1_month': 'so với tháng trước',
  '3_month': 'so với 3 tháng trước',
  '6_month': 'so với 6 tháng trước',
  '1_year': 'so với năm trước',
  _all: 'so với toàn bộ thời gian trước đó',
  _custom: 'so với kì trước'
};
