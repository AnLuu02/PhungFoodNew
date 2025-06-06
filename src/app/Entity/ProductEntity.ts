import { ProductStatus } from '@prisma/client';

export type Product = {
  id: string;

  name: string;

  description?: string;

  descriptionDetail?: string;

  price: number;

  discount: number;

  region: string;

  status: ProductStatus;

  tags: string[];

  thumbnail?: File;

  gallery: File[];

  tag?: string;

  soldQuantity: number;

  availableQuantity: number;

  rating: number;

  totalRating: number;

  subCategoryId: string;

  materials: string[];
};
