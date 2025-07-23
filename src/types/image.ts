import { EntityType, ImageType } from '@prisma/client';

export type Image = {
  id: string;

  url?: File;

  altText: string;

  type: ImageType;

  entityId: string;

  entityType: EntityType;
};
