export type Product = {
  id: string;

  name: string;

  description?: string;

  descriptionDetailJson?: any;

  descriptionDetailHtml?: string;

  price: number;

  discount: number;

  region: string;

  isActive: boolean;

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

type DesDetailItem = {
  label: string;
  value: string;
};
