import { SubCategory } from './SubCategoryEntity';

export type Category = {
  id: string;

  name: string;

  tag: string;

  description?: string;

  subCategory?: SubCategory[];
};
