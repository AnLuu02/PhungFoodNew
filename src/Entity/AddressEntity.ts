import { AddressType } from '@prisma/client';

export type Address = {
  id: string;

  type: AddressType;

  provinceId?: string;

  districtId?: string;

  wardId?: string;

  province?: string;

  district?: string;

  ward?: string;

  detail?: string;

  postalCode?: string;

  fullAddress?: string;
};
