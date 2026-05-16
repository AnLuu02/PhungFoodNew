import { EntityType, ImageType, Prisma } from '@prisma/client';
import { z } from 'zod';
import {
  activityLogger,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  requirePermission
} from '~/server/api/trpc';
import {
  bulkDeleteImagesService,
  bulkUpdateImageTypeService,
  checkExistingImageService,
  connectedEntityService,
  deleteImageService,
  detachAllAssociationsService,
  detachImageFromEntityService,
  getAllImageService,
  getImageByIdService,
  getImageForEntityService,
  updateImageMetadataService,
  upsertImageService
} from '~/server/services/image.service';
import { imageFromDbSchema } from '~/shared/schema/image.schema';
export const imagesRouter = createTRPCRouter({
  checkExisting: publicProcedure
    .input(z.object({ publicId: z.string() }))
    .query(async ({ ctx, input }) => await checkExistingImageService(ctx.db, input)),
  upsert: publicProcedure
    .use(activityLogger)
    .input(imageFromDbSchema)
    .mutation(async ({ ctx, input }) => await upsertImageService(ctx.db, input)),

  delete: publicProcedure
    .use(requirePermission(undefined, { requiredAdmin: true }))
    .use(activityLogger)
    .input(z.object({ publicId: z.string() }))
    .mutation(async ({ ctx, input }) => await deleteImageService(ctx.db, input)),

  getAllImages: protectedProcedure
    .input(
      z.object({
        imageTypes: z.array(z.nativeEnum(ImageType)).optional(),
        entityTypes: z.array(z.nativeEnum(EntityType)).optional(),
        showOrphanedOnly: z.boolean().optional().default(false),
        searchQuery: z.string().optional(),
        skip: z.number().optional().default(0),
        take: z.number().optional().default(24),
        include: z.custom<Prisma.ImageInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await getAllImageService(ctx.db, input)),
  getImageForEntity: protectedProcedure
    .input(
      z.object({
        entityId: z.string(),
        include: z.custom<Prisma.ImageInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await getImageForEntityService(ctx.db, input)),
  getImageById: protectedProcedure
    .input(z.object({ id: z.string().cuid(), include: z.custom<Prisma.ImageInclude>().optional() }))
    .query(async ({ ctx, input }) => await getImageByIdService(ctx.db, input)),

  updateImageMetadata: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        altText: z.string().max(500).optional(),
        type: z.nativeEnum(ImageType).optional()
      })
    )
    .mutation(async ({ ctx, input }) => await updateImageMetadataService(ctx.db, input)),

  detachImageFromEntity: protectedProcedure
    .input(
      z.object({
        imageId: z.string().cuid(),
        entityId: z.string(),
        entityType: z.nativeEnum(EntityType)
      })
    )
    .mutation(async ({ ctx, input }) => await detachImageFromEntityService(ctx.db, input)),

  detachAllAssociations: protectedProcedure
    .input(z.object({ imageId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => await detachAllAssociationsService(ctx.db, input)),

  bulkDeleteImages: protectedProcedure
    .input(
      z.object({
        imageIds: z.array(z.string().cuid()).min(1),
        deleteOrphaned: z.boolean().optional().default(false)
      })
    )
    .mutation(async ({ ctx, input }) => await bulkDeleteImagesService(ctx.db, input)),

  bulkUpdateImageType: protectedProcedure
    .input(
      z.object({
        imageIds: z.array(z.string().cuid()).min(1),
        newType: z.nativeEnum(ImageType)
      })
    )
    .mutation(async ({ ctx, input }) => bulkUpdateImageTypeService(ctx.db, input)),

  getEnumOptions: publicProcedure.query(async () => {
    return {
      imageTypes: Object.values(ImageType),
      entityTypes: Object.values(EntityType)
    };
  }),
  connectedEntity: protectedProcedure
    .input(
      z.object({
        entityId: z.string(),
        entityType: z.nativeEnum(EntityType),
        images: z
          .array(
            z.object({
              id: z.string(),
              imageForEntityId: z.string().optional(),
              altText: z.string(),
              type: z.nativeEnum(ImageType),
              mode: z.enum(['connect', 'disconnect']).default('connect')
            })
          )
          .default([])
      })
    )
    .mutation(async ({ ctx, input }) => await connectedEntityService(ctx.db, input))
});
