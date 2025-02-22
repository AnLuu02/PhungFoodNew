import { Gender, UserLevel, UserRole } from '@prisma/client';
import { Image } from './ImageEntity';

export type User = {
  id: string;

  name: string;

  email: string;

  image?: Image;

  password: string;

  role: UserRole;

  phone?: string;

  address?: string;

  dateOfBirth?: Date;

  gender: Gender;

  pointLevel: number;

  level: UserLevel;

  revenueId?: string;

  voucherId?: string;
};
