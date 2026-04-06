import { EntityType, ImageType, Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { ImageAssociation, ImageWithAssociations } from '~/app/admin/images/types/image.types';
import cloudinary from '~/lib/Cloudinary/cloudinary';
import { createTRPCRouter, protectedProcedure, publicProcedure, requirePermission } from '~/server/api/trpc';
import { findContactService } from '~/server/services/contact.service';
import {
  bulkUpsertImageService,
  checkExistingImageService,
  deleteImageService,
  upsertImageService
} from '~/server/services/image.service';
import { imageFromDbSchema } from '~/shared/schema/image.schema';
export const imagesRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => await findContactService(ctx.db, input)),

  upsert: publicProcedure
    .input(imageFromDbSchema)
    .mutation(async ({ ctx, input }) => await upsertImageService(ctx.db, input)),
  bulkUpsert: publicProcedure
    .input(z.array(imageFromDbSchema))
    .mutation(async ({ ctx, input }) => await bulkUpsertImageService(ctx.db, input)),

  delete: publicProcedure
    .use(requirePermission(undefined, { requiredAdmin: true }))
    .input(z.object({ publicId: z.string() }))
    .mutation(async ({ ctx, input }) => await deleteImageService(ctx.db, input)),
  checkExisting: publicProcedure
    .input(z.object({ publicId: z.string() }))
    .query(async ({ ctx, input }) => await checkExistingImageService(ctx.db, input)),
  getAll: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        limit: z.number().min(1).max(500).default(20),
        cursor: z.string().nullish()
      })
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.image.findMany({
        take: input.limit + 1,
        where: input.search
          ? {
              altText: { contains: input.search, mode: 'insensitive' },
              url: { contains: 'res.cloudinary.com', mode: 'insensitive' },
              publicId: { not: null }
            }
          : {
              url: { contains: 'res.cloudinary.com', mode: 'insensitive' },
              publicId: { not: null }
            },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: 'desc' }
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }
      return { items, nextCursor };
    }),
  getAllImages: protectedProcedure
    .input(
      z.object({
        imageTypes: z.array(z.nativeEnum(ImageType)).optional(),
        entityTypes: z.array(z.nativeEnum(EntityType)).optional(),
        showOrphanedOnly: z.boolean().optional().default(false),
        searchQuery: z.string().optional(),
        skip: z.number().optional().default(0),
        take: z.number().optional().default(24)
      })
    )
    .query(async ({ ctx, input }) => {
      const { imageTypes, entityTypes, showOrphanedOnly, searchQuery, skip, take } = input;

      const where: Prisma.ImageWhereInput = {
        AND: [
          imageTypes?.length ? { type: { in: imageTypes } } : {},
          entityTypes?.length ? { entityType: { in: entityTypes } } : {},
          searchQuery
            ? {
                OR: [
                  { altText: { contains: searchQuery, mode: 'insensitive' } },
                  { url: { contains: searchQuery, mode: 'insensitive' } }
                ]
              }
            : {},
          showOrphanedOnly
            ? {
                AND: [{ productId: null }, { bannerId: null }, { userId: null }, { restaurantId: null }]
              }
            : {}
        ]
      };

      const [images, total] = await ctx.db.$transaction([
        ctx.db.image.findMany({
          where,
          include: {
            product: true,
            banner: true,
            user: true,
            restaurant: true,
            subCategories: true
          },
          skip,
          take,
          orderBy: { createdAt: 'desc' }
        }),
        ctx.db.image.count({ where })
      ]);

      return {
        data: images.map(img => enrichImageWithAssociations(img)),
        total,
        pageInfo: {
          skip,
          take,
          hasMore: skip + take < total
        }
      };
    }),

  getImageById: protectedProcedure.input(z.object({ id: z.string().cuid() })).query(async ({ ctx, input }) => {
    const image = await ctx.db.image.findUnique({
      where: { id: input.id },
      include: {
        product: true,
        banner: true,
        user: true,
        restaurant: true,
        subCategories: true
      }
    });

    if (!image) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Image not found'
      });
    }

    return enrichImageWithAssociations(image);
  }),

  updateImageMetadata: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        altText: z.string().max(500).optional(),
        type: z.nativeEnum(ImageType).optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, altText, type } = input;

      const updated = await ctx.db.image.update({
        where: { id },
        data: {
          ...(altText !== undefined && { altText }),
          ...(type !== undefined && { type }),
          updatedAt: new Date()
        },
        include: {
          product: true,
          banner: true,
          user: true,
          restaurant: true,
          subCategories: true
        }
      });

      return enrichImageWithAssociations(updated);
    }),

  detachImageFromEntity: protectedProcedure
    .input(
      z.object({
        imageId: z.string().cuid(),
        entityType: z.nativeEnum(EntityType)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { imageId, entityType } = input;

      const image = await ctx.db.image.findUnique({
        where: { id: imageId },
        include: { subCategories: true }
      });

      if (!image) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Image not found'
        });
      }

      const detachData: Prisma.ImageUpdateInput = {};

      switch (entityType) {
        case EntityType.PRODUCT:
          detachData.product = {
            disconnect: {
              images: {
                some: {
                  id: imageId
                }
              }
            }
          };
          break;
        case EntityType.SUB_CATEGORY:
          if (image.subCategories.length > 0) {
            await ctx.db.subCategory.updateMany({
              where: { id: { in: image.subCategories.map(sc => sc.id) } },
              data: { imageId: null }
            });
          }
          break;
        case EntityType.BANNER:
          detachData.banner = {
            disconnect: {
              images: {
                some: {
                  id: imageId
                }
              }
            }
          };
          break;
        case EntityType.USER:
          detachData.user = {
            disconnect: {
              image: {
                id: imageId
              }
            }
          };
          break;
        case EntityType.RESTAURANT:
          detachData.restaurant = {
            disconnect: {
              logo: {
                id: imageId
              }
            }
          };
          break;
      }

      const updated = await ctx.db.image.update({
        where: { id: imageId },
        data: detachData,
        include: {
          product: true,
          banner: true,
          user: true,
          restaurant: true,
          subCategories: true
        }
      });

      return enrichImageWithAssociations(updated);
    }),

  detachAllAssociations: protectedProcedure
    .input(z.object({ imageId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const image = await ctx.db.image.findUnique({
        where: { id: input.imageId },
        include: { subCategories: true }
      });

      if (!image) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Image not found'
        });
      }

      if (image.subCategories.length > 0) {
        await ctx.db.subCategory.updateMany({
          where: { id: { in: image.subCategories.map(sc => sc.id) } },
          data: { imageId: null }
        });
      }

      const updated = await ctx.db.image.update({
        where: { id: input.imageId },
        data: {
          productId: null,
          bannerId: null,
          userId: null,
          restaurantId: null,
          updatedAt: new Date()
        },
        include: {
          product: true,
          banner: true,
          user: true,
          restaurant: true,
          subCategories: true
        }
      });

      return enrichImageWithAssociations(updated);
    }),

  bulkDeleteImages: protectedProcedure
    .input(
      z.object({
        imageIds: z.array(z.string().cuid()).min(1),
        deleteOrphaned: z.boolean().optional().default(false)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { imageIds, deleteOrphaned } = input;

      if (!deleteOrphaned) {
        const associatedImages = await ctx.db.image.findMany({
          where: {
            id: { in: imageIds },
            OR: [
              { productId: { not: null } },
              { bannerId: { not: null } },
              { userId: { not: null } },
              { restaurantId: { not: null } }
            ]
          }
        });

        if (associatedImages.length > 0) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: `${associatedImages.length} image(s) are still associated with entities. Detach them first or use deleteOrphaned flag.`
          });
        }
      }

      await deleteFromCloudinary(imageIds, ctx);

      const deleted = await ctx.db.image.deleteMany({
        where: { id: { in: imageIds } }
      });

      return {
        success: true,
        deletedCount: deleted.count
      };
    }),

  bulkUpdateImageType: protectedProcedure
    .input(
      z.object({
        imageIds: z.array(z.string().cuid()).min(1),
        newType: z.nativeEnum(ImageType)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { imageIds, newType } = input;

      const updated = await ctx.db.image.updateMany({
        where: { id: { in: imageIds } },
        data: {
          type: newType,
          updatedAt: new Date()
        }
      });

      return {
        success: true,
        updatedCount: updated.count
      };
    }),

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
              mode: z.enum(['connect', 'disconnect']).default('connect')
            })
          )
          .default([])
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { entityId, entityType, images } = input;
      if (!entityId || !images) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Du lieu khong hop le.' });
      const { imageConnect, imageDisconnect } = images.reduce(
        (
          acc: {
            imageConnect: { id: string; mode: 'connect' | 'disconnect' }[];
            imageDisconnect: { id: string; mode: 'connect' | 'disconnect' }[];
          },
          item: { id: string; mode: 'connect' | 'disconnect' }
        ) => {
          item && item.mode === 'connect' && acc.imageConnect.push(item);
          item && item.mode === 'disconnect' && acc.imageDisconnect.push(item);
          return acc;
        },
        { imageConnect: [], imageDisconnect: [] }
      );
      console.log('imageConnectimageConnect', imageConnect, imageDisconnect);

      const excuted = {
        ...(imageConnect?.length > 0
          ? imageConnect.map(item => ({
              connect: {
                id: item?.id
              }
            }))
          : {}),
        ...(imageDisconnect?.length > 0
          ? imageDisconnect.map(item => ({
              disconnect: {
                id: item?.id
              }
            }))
          : {})
      };
      switch (entityType) {
        case EntityType.PRODUCT:
          return await ctx.db.product.update({
            where: {
              id: entityId
            },
            data: {
              images: excuted
            }
          } as any);
        case EntityType.BANNER:
          return await ctx.db.banner.update({
            where: {
              id: entityId
            },
            data: {
              images: excuted
            }
          } as any);
        case EntityType.RESTAURANT:
          return await ctx.db.restaurant.update({
            where: {
              id: entityId
            },
            data: {
              logo: {
                ...(imageConnect.length > 0
                  ? {
                      connect: {
                        id: imageConnect?.[0]?.id
                      }
                    }
                  : {}),
                ...(imageDisconnect.length > 0
                  ? {
                      disconnect: {
                        id: imageDisconnect?.[0]?.id
                      }
                    }
                  : {})
              }
            }
          } as any);
        case EntityType.SUB_CATEGORY:
          return await ctx.db.subCategory.update({
            where: {
              id: entityId
            },
            data: {
              image: {
                ...(imageConnect.length > 0
                  ? {
                      connect: {
                        id: imageConnect?.[0]?.id
                      }
                    }
                  : {}),
                ...(imageDisconnect.length > 0
                  ? {
                      disconnect: {
                        id: imageDisconnect?.[0]?.id
                      }
                    }
                  : {})
              }
            }
          });
        case EntityType.SUB_CATEGORY:
          return await ctx.db.subCategory.update({
            where: {
              id: entityId
            },
            data: {
              image: {
                ...(imageConnect.length > 0
                  ? {
                      connect: {
                        id: imageConnect?.[0]?.id
                      }
                    }
                  : {}),
                ...(imageDisconnect.length > 0
                  ? {
                      disconnect: {
                        id: imageDisconnect?.[0]?.id
                      }
                    }
                  : {})
              }
            }
          } as any);
        case EntityType.USER:
          return await ctx.db.user.update({
            where: {
              id: entityId
            },
            data: {
              image: {
                ...(imageConnect.length > 0
                  ? {
                      connect: {
                        id: imageConnect?.[0]?.id
                      }
                    }
                  : {}),
                ...(imageDisconnect.length > 0
                  ? {
                      disconnect: {
                        id: imageDisconnect?.[0]?.id
                      }
                    }
                  : {})
              }
            }
          } as any);
        default:
          return;
      }
    })
});

/**
 * Enriches an image record with association metadata
 */
function enrichImageWithAssociations(image: any): ImageWithAssociations {
  const associations: ImageAssociation[] = [];

  if (image.product) {
    associations.push({
      type: EntityType.PRODUCT,
      name: image.product.name,
      id: image.product.id,
      label: `Product: ${image.product.name}`
    });
  }

  if (image.banner) {
    associations.push({
      type: EntityType.BANNER,
      name: image.banner.title || 'Untitled Banner',
      id: image.banner.id,
      label: `Banner: ${image.banner.title || 'Untitled'}`
    });
  }

  if (image.user) {
    associations.push({
      type: EntityType.USER,
      name: image.user.name || image.user.email,
      id: image.user.id,
      label: `User: ${image.user.name || image.user.email}`
    });
  }

  if (image.restaurant) {
    associations.push({
      type: EntityType.RESTAURANT,
      name: image.restaurant.name,
      id: image.restaurant.id,
      label: `Restaurant: ${image.restaurant.name}`
    });
  }

  if (image.subCategories && image.subCategories.length > 0) {
    image.subCategories.forEach((sc: any) => {
      associations.push({
        type: EntityType.SUB_CATEGORY,
        name: sc.name,
        id: sc.id,
        label: `Category: ${sc.name}`
      });
    });
  }

  return {
    ...image,
    associations,
    isOrphaned: associations.length === 0,
    usageCount: associations.length
  };
}
async function deleteFromCloudinary(imageIds: string[], ctx: any) {
  const publicIds = await ctx.db.image.findMany({
    where: { id: { in: imageIds } },
    select: { publicId: true }
  });
  for (const { publicId } of publicIds) {
    if (publicId) await cloudinary.api.delete_resources([publicId]);
  }
}
