import { Image } from './image';

export type Restaurant = {
  id?: string;

  name: string;

  address: string;

  phone: string;

  email: string;

  description?: string;

  logo: Image;

  website: string;

  socials: Social[];

  openingHours: OpeningHour[];

  theme?: Theme;
};
export type OpeningHour = {
  id: string;

  dayOfWeek: string;

  viNameDay: string;

  openTime?: string;

  isClosed: boolean;

  closeTime?: string;

  restaurantId: number;
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

export type Theme = {
  id?: string;

  primaryColor: string;

  secondaryColor: string;

  themeMode: 'light' | 'dark' | 'auto';

  fontFamily?: string;

  borderRadius?: string;

  faviconUrl?: string;
};
