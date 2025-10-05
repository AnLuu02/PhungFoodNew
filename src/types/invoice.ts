export type Invoice = {
  id: string;

  orderId: string;

  salerId: string;

  invoiceNumber: string;

  status: 'PAID' | 'PENDING' | 'CANCELLED';

  currency: 'VND' | 'USD' | 'EURO';

  taxCode?: string;
};
