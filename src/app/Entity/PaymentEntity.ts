import { PaymentType } from '@prisma/client';

export type Payment = {
  id: string;

  name: string;

  tag: string;

  type: PaymentType;

  provider: string;

  isDefault: boolean;

  revenueId?: string;
};
