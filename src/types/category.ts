import { Image } from './image';

export type SubCategory = {
  id: string;

  name: string;

  isActive: boolean;

  tag?: string;

  thumbnail?: Image;

  categoryId: string;

  description?: string;
};
export type Category = {
  id: string;

  name: string;

  isActive: boolean;

  tag?: string;

  description?: string;

  subCategory?: SubCategory[];
};
