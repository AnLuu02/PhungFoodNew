import { EntityType, ImageType } from '@prisma/client';
import z from 'zod';
export const baseImageSchema = z.object({
  id: z.string().optional(),
  // url: z.any().optional(),
  altText: z.string().optional(),
  type: z.nativeEnum(ImageType).default(ImageType.THUMBNAIL),
  entityId: z.string().optional(),
  entityType: z.nativeEnum(EntityType).optional()
});
export const imageFromDbSchema = baseImageSchema.extend({
  url: z.string().optional()
});

export const imageReqSchema = z.object({
  fileName: z.string(),
  base64: z.string()
});
export const imageInputSchema = baseImageSchema.extend({
  url: z.instanceof(File).optional()
});

export type ImageFromDb = z.infer<typeof imageFromDbSchema>;
export type ImageReq = z.infer<typeof imageReqSchema>;
export type ImageInput = z.infer<typeof imageInputSchema>;
