import { SubCategory } from './subCategory';

export type Category = {
  id: string;

  name: string;

  tag?: string;

  description?: string;

  subCategory?: SubCategory[];
};
