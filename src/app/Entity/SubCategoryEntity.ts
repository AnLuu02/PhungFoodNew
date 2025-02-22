import { Image } from './ImageEntity';

export type SubCategory = {
  id: string;

  name: string;

  tag: string;

  thumbnail?: Image;

  categoryId: string;

  description?: string;
};
