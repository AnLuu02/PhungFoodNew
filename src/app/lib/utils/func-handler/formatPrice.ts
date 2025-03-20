const EMPTY_STRING = '';
export const VND_SYMBOL = '₫';
export const USD_SYMBOL = '$';

export const formatPriceLocaleVi = (value: number | string, suffix = VND_SYMBOL) => {
  const valStr =
    (typeof value === 'number' && Number.isFinite(value)) ||
    (typeof value === 'string' && !Number.isNaN(parseFloat(value)))
      ? value.toString()
      : EMPTY_STRING;
  return valStr ? valStr.replace(/\B(?<!\,\d*)(?=(\d{3})+(?!\d))/g, '.') + suffix : EMPTY_STRING;
};
