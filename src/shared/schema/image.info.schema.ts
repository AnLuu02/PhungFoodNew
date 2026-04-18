import { EntityType, ImageType } from '@prisma/client';
import z from 'zod';
import { imageFromDbSchema, imageInputSchema } from './image.schema';

export enum StatusImage {
  NEW = 'NEW',
  DELETED = 'DELETED',
  EXISTING = 'EXISTING'
}
export const baseImageInfoSchema = z.object({
  id: z.string().optional(),
  altText: z.string().optional(),
  type: z.nativeEnum(ImageType).default(ImageType.THUMBNAIL),
  entityId: z.string().optional(),
  entityType: z.nativeEnum(EntityType).optional(),
  status: z.nativeEnum(StatusImage).optional()
});
export const imageInfoFromDbSchema = baseImageInfoSchema.extend({
  image: imageFromDbSchema.optional()
});

export const imageInfoInputSchema = baseImageInfoSchema.extend({
  image: imageInputSchema.optional()
});

export type ImageInfoFromDb = z.infer<typeof imageInfoFromDbSchema>;
export type ImageInfoInput = z.infer<typeof imageInfoInputSchema>;
