import { Period } from '../types';

export const PeriodFilter: Record<
  Period,
  { key: Period; unit: 'day' | 'month' | 'year' | 'other'; label: string; value: number }
> = {
  _today: {
    key: '_today',
    unit: 'day',
    value: 0,
    label: 'Hôm nay'
  },
  _all: {
    key: '_all',
    unit: 'day',
    value: Infinity,
    label: 'Tất cả'
  },
  _custom: {
    key: '_custom',
    unit: 'day',
    value: -1,
    label: 'Tùy chỉnh'
  },
  '7_day': {
    key: '7_day',
    unit: 'day',
    value: 7,
    label: '7 ngày qua'
  },
  '15_day': {
    key: '15_day',
    unit: 'day',
    value: 15,
    label: '15 ngày qua'
  },
  '1_month': {
    key: '1_month',
    unit: 'month',
    value: Infinity,
    label: 'Tất cả'
  },
  '3_month': {
    key: '3_month',
    unit: 'month',
    value: Infinity,
    label: 'Tất cả'
  },
  '6_month': {
    key: '6_month',
    unit: 'month',
    value: Infinity,
    label: 'Tất cả'
  },
  '1_year': {
    key: '1_year',
    unit: 'year',
    value: Infinity,
    label: 'Tất cả'
  }
};

export const DATA_SELECT_PERIOD: { value: Period; label: string; disabled?: boolean }[] = [
  {
    value: '_all',
    label: 'Tất cả'
  },
  {
    value: '_today',
    label: 'Hôm nay'
  },
  {
    value: '7_day',
    label: '7 ngày qua'
  },
  {
    value: '15_day',
    label: '15 ngày qua'
  },
  {
    value: '1_month',
    label: '30 ngày qua'
  },
  {
    value: '3_month',
    label: '3 tháng qua'
  },
  {
    value: '6_month',
    label: '6 tháng qua'
  },
  {
    value: '1_year',
    label: 'Năm vừa rồi'
  },
  {
    value: '_custom',
    label: 'Tùy chỉnh',
    disabled: true
  }
];
