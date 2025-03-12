import { Gender, UserLevel } from '@prisma/client';
import { Address } from './AddressEntity';
import { Image } from './ImageEntity';

export type User = {
  id: string;

  name: string;

  email: string;

  image?: Image;

  roleId?: string;

  password: string;

  phone?: string;

  address?: Address;

  dateOfBirth?: Date;

  gender: Gender;

  pointLevel: number;

  level: UserLevel;

  revenueId?: string;

  voucherId?: string;
};
