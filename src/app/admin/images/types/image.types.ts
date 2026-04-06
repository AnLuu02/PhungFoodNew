import { EntityType, ImageType, Image as PrismaImage } from '@prisma/client';

export interface ImageWithAssociations extends PrismaImage {
  associations: ImageAssociation[];
  isOrphaned: boolean;
  usageCount: number;
}

export interface ImageAssociation {
  type: EntityType;
  name: string;
  id: string;
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

export interface ImageFilterOptions {
  imageTypes: ImageType[];
  entityTypes: EntityType[];
  showOrphanedOnly: boolean;
  searchQuery: string;
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
