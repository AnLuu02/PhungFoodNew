import { EMPTY_STRING, VND_SYMBOL } from '~/constants';
import dayjs from '~/lib/dayjs';
import { FormatDateViVNOptions, MoneyValue } from '~/shared/types';

export const formatDateViVN = (date?: Date | string | number | null, options?: FormatDateViVNOptions) => {
  const { hour = false, format, fallback = EMPTY_STRING } = options || {};

  if (!date) return fallback;

  const defaultFormat = hour ? 'DD-MM-YYYY HH:mm' : 'DD-MM-YYYY';

  return dayjs(date)
    .tz()
    .format(format || defaultFormat);
};
export function formatTimeAgo(date: Date | string | number): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 5) return 'Vừa xong';
  if (diffInSeconds < 60) return `${diffInSeconds} giây trước`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} ngày trước`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks} tuần trước`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} tháng trước`;

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} năm trước`;
}

export const formatTransDate = (iso: string): string => {
  const date = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds())
  );
};

export const formatCustomTimestamp = (timestamp: string) => {
  if (!timestamp || timestamp.length !== 14) return 'N/A';
  const year = timestamp.slice(0, 4);
  const month = timestamp.slice(4, 6);
  const day = timestamp.slice(6, 8);
  const hour = timestamp.slice(8, 10);
  const minute = timestamp.slice(10, 12);
  const second = timestamp.slice(12, 14);
  return ` ${hour}:${minute}:${second}, ${day}/${month}/${year} `;
};

export const formatDataExcel = (mapFields: Record<string, string>, rows: any[]) => {
  return rows.map(row => {
    const formattedRow: Record<string, any> = {};
    for (const key in row) {
      const mappedKey = mapFields[key] || mapFields.key || key;
      formattedRow[mappedKey] = row[key];
    }
    return formattedRow;
  });
};

export const formatPriceLocaleVi = (value: number | string | null | undefined, suffix = VND_SYMBOL) => {
  if (value === null || value === undefined || value === '') return EMPTY_STRING;

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) return EMPTY_STRING;

  const roundedValue = Math.round(numberValue);

  return roundedValue.toLocaleString('vi-VN') + suffix;
};

export function isStillValid({ createdAt, limitTime }: { createdAt: Date; limitTime: number }): boolean {
  const expiredAt = new Date(createdAt.getTime() + limitTime * 60 * 1000);
  return new Date() <= expiredAt;
}

export function formatMoneyShort(amount: number): string {
  if (amount >= 1_000_000_000) {
    const billions = amount / 1_000_000_000;
    return (billions % 1 === 0 ? billions : billions.toFixed(1)) + ' tỉ';
  } else if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    return (millions % 1 === 0 ? millions : millions.toFixed(1)) + 'tr';
  } else if (amount >= 1_000) {
    const thousands = amount / 1_000;
    return (thousands % 1 === 0 ? thousands : thousands.toFixed(1)) + 'nghìn';
  }
  return amount.toString();
}

export const toNumber = (value?: string) => {
  if (!value) return undefined;

  const num = Number(value);

  return Number.isNaN(num) ? undefined : num;
};

export const moneyToNumber = (value: MoneyValue) => {
  if (value === null || value === undefined) return 0;

  if (typeof value === 'number') return value;

  if (typeof value === 'string') return Number(value);

  return Number(value.toString());
};

export const toIsoString = (value?: Date | string | null) => {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : value;
};
