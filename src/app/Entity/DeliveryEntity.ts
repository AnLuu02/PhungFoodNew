import { Address } from './AddressEntity';

export type Delivery = {
  id: string;

  name?: string;

  email?: string;

  phone?: string;

  address?: Address;

  note?: string;

  orderId?: string;
};
