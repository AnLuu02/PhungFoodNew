export const renderShortId = (prefix: string, length: number, id?: string | null) => {
  if (!id || typeof id !== 'string') return 'Đang cập nhật';

  const cleanId = id.replace(/-/g, '');
  const shortPart = cleanId.slice(-length).toUpperCase();

  return `${prefix}-${shortPart}`;
};
