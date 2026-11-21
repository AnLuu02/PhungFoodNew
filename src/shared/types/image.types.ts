import {
  Banner,
  EntityType,
  Image,
  ImageForEntity,
  ImageType,
  Image as PrismaImage,
  Product,
  Restaurant,
  SubCategory,
  User
} from '@prisma/client';

export interface ImageWithAssociations extends PrismaImage {
  associations: ImageAssociation[];
  isOrphaned: boolean;
  usageCount: number;
}

export interface ImageAssociation {
  id: string;
  imageForEntityId: string;
  type: EntityType;
  name: string;
  label: string;
}

export interface ImageDetailState {
  id: string;
  url: string;
  width: number | null;
  height: number | null;
  format: string | null;
  altText: string | null;
  type: ImageType;
  entityType: EntityType;
  associations: ImageAssociation[];
  createdAt: Date | null;
  updatedAt: Date | null;
  isOrphaned: boolean;
}

export type ImageWithAssociationInput = Image & {
  users?: User[] | null;
  restaurants?: Restaurant[] | null;
  subCategories?: SubCategory[] | null;
  imageForEntities?: (ImageForEntity & { banner?: Banner | null; product?: Product | null })[] | null;
};

export interface ImageFilterOptions {
  imageType?: ImageType;
  entityType?: EntityType;
  showOrphanedOnly?: boolean;
  searchQuery?: string;
}

export interface BulkImageAction {
  action: 'delete' | 'detach' | 'updateType';
  imageIds: string[];
  payload?: Record<string, any>;
}

export interface ImageUploadResponse {
  id: string;
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

export interface ImageUIState extends ImageWithAssociations {
  isSelected: boolean;
  isLoading: boolean;
  error: string | null;
}

export type ConnectedState = {
  opened: boolean;
  imageId?: string;
  imageType?: ImageType;
  mode?: 'disconnect' | 'connect';
  onRefetch?: () => void;
};
export type ConnectedStateWithEntity = ConnectedState & {
  entityId?: string;
  entityType?: EntityType;
  imageForEntityId?: string;
};
