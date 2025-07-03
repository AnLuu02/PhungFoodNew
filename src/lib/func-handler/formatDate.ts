export const formatDate = (date?: any) => {
  return new Date(date || new Date()).toLocaleDateString();
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

export const formatTransDate = (date: Date) => {
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}`;
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
