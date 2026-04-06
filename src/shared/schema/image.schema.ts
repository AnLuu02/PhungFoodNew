import { EntityType, ImageType } from '@prisma/client';
import z from 'zod';

export enum StatusImage {
  NEW = 'NEW',
  DELETED = 'DELETED',
  EXISTING = 'EXISTING'
}
export const baseImageSchema = z.object({
  id: z.string().optional(),
  publicId: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  format: z.string().optional(),
  altText: z.string().optional(),
  type: z.nativeEnum(ImageType).default(ImageType.THUMBNAIL),
  entityId: z.string().optional(),
  entityType: z.nativeEnum(EntityType).optional(),
  status: z.nativeEnum(StatusImage).optional()
});
export const imageFromDbSchema = baseImageSchema.extend({
  url: z.string().optional()
});

export const imageInputSchema = baseImageSchema.extend({
  url: z.string().optional(),
  urlFile: z.instanceof(File).nullable().optional()
});

export type ImageFromDb = z.infer<typeof imageFromDbSchema>;
export type ImageInput = z.infer<typeof imageInputSchema>;
