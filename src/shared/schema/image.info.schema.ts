import { EntityType, ImageType } from '@prisma/client';
import z from 'zod';
import { imageClientInputSchema, imageServerInputSchema } from './image.schema';

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
export const imageInfoServerInputSchema = baseImageInfoSchema.extend({
  image: imageServerInputSchema.optional()
});

export const imageInfoClientInputSchema = baseImageInfoSchema.extend({
  image: imageClientInputSchema.optional()
});

export type ImageInfoServerInput = z.infer<typeof imageInfoServerInputSchema>;
export type ImageInfoClientInput = z.infer<typeof imageInfoClientInputSchema>;
