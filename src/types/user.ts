import { Gender, UserLevel } from '@prisma/client';
import { Address } from './address';
import { Image } from './image';

export type User = {
  id: string;

  name: string;

  email: string;

  image?: Image;

  roleId: string;

  password: string;

  phone: string;

  address?: Address;

  dateOfBirth?: Date;

  gender: Gender;

  pointUser: number;

  level: UserLevel;

  revenueId?: string;

  voucherId?: string;
};
