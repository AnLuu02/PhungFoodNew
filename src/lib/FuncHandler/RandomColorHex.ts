export const randomColorHex = (index: number = 1) =>
  '#' +
  Math.floor(Math.random() * 16777215 * index)
    .toString(16)
    .padStart(6, '0');
