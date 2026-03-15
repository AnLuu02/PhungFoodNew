import z from 'zod';

export const basePaymentSchema = z
  .object({
    id: z.string().optional(),
    provider: z
      .string({ required_error: 'Nhà cung cấp không được để trống.' })
      .min(1, 'Nhà cung cấp không được để trống.')
      .toLowerCase(),
    name: z
      .string({ required_error: 'Hãy đặt tên cho phương thức thanh toán.' })
      .min(1, 'Hãy đặt tên cho phương thức thanh toán.'),
    apiKey: z.string().optional(),
    secretKey: z.string().optional(),
    clientId: z.string().optional(),
    clientSecret: z.string().optional(),
    webhookUrl: z.string().optional(),
    webhookSecret: z.string().optional(),
    isSandbox: z.boolean().default(true),
    isActive: z.boolean().default(true),
    metadata: z.any().optional()
  })
  .transform(data => ({
    ...data,
    provider: data.provider.replace(/\s+/g, '')
  }));

export type PaymentInput = z.infer<typeof basePaymentSchema>;
