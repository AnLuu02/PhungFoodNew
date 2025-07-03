import { Image } from './ImageEntity';

export type Restaurant = {
  id?: string;

  name: string;

  address: string;

  phone: string;

  email: string;

  isClose: boolean;

  description?: string;

  logo: Image;

  website: string;

  socials: Social[];

  openedHours?: string;

  closedHours?: string;
};

type Social = {
  id: string;
  key: string;
  url: string;
};

export type Banner = {
  id: string;

  banner1: File | null;

  banner2: File | null;

  gallery: File[];

  isActive: boolean;

  startDate: Date;

  endDate: Date;
};
