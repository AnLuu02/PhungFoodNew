import z from 'zod';

export const moneySchema = z
  .number({ required_error: 'Giá trị phải không âm.' })
  .min(0, 'Giá trị phải không âm.')
  .default(0);
