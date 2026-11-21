import { ImageType } from '@prisma/client';
import z from 'zod';

export const baseImageSchema = z.object({
  id: z.string().optional(),
  publicId: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  format: z.string().optional(),
  altText: z.string().optional(),
  type: z.nativeEnum(ImageType).default(ImageType.THUMBNAIL)
});
export const imageServerInputSchema = baseImageSchema.extend({
  url: z.string().optional()
});

export const imageClientInputSchema = baseImageSchema.extend({
  url: z.string().optional(),
  urlFile: z.instanceof(File).nullable().optional()
});

export type ImageServerInput = z.infer<typeof imageServerInputSchema>;
export type ImageClientInput = z.infer<typeof imageClientInputSchema>;
