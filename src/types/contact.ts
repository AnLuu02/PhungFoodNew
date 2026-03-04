import { TypeContact } from '@prisma/client';

export type Contact = {
  id: string;

  fullName: string;

  email: string;

  phone: string;

  message: string;

  subject?: string;

  type: TypeContact;

  responded: boolean;
};
