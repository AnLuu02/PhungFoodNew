import { EntityType, ImageType, Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { ImageAssociation, ImageWithAssociations } from '~/app/admin/images/types/image.types';
import cloudinary from '~/lib/Cloudinary/cloudinary';
import {
  activityLogger,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  requirePermission
} from '~/server/api/trpc';
import { checkExistingImageService, deleteImageService, upsertImageService } from '~/server/services/image.service';
import { getOneBannerService } from '~/server/services/restaurant.banner.service';
import { getOneActiveClientService } from '~/server/services/restaurant.service';
import { getOneUserService } from '~/server/services/user.service';
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
        take: z.number().optional().default(24)
      })
    )
    .query(async ({ ctx, input }) => {
      const { imageTypes, entityTypes, showOrphanedOnly, searchQuery, skip, take } = input;

      const where: Prisma.ImageWhereInput = {
        AND: [
          imageTypes?.length ? { type: { in: imageTypes } } : {},
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
                imageForEntities: {
                  some: {}
                }
              }
            : {}
        ]
      };

      const [images, total] = await ctx.db.$transaction([
        ctx.db.image.findMany({
          where,
          include: {
            imageForEntities: {
              include: {
                product: true,
                banner: true,
                user: true,
                restaurant: true,
                subCategory: true
              }
            }
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
  getImageForEntity: protectedProcedure
    .input(
      z.object({
        entityId: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const { entityId } = input;
      return await ctx.db.imageForEntity.findMany({
        where: {
          OR: [
            {
              subCategoryId: entityId
            },
            {
              bannerId: entityId
            },
            {
              restaurantId: entityId
            },
            {
              productId: entityId
            },
            {
              userId: entityId
            }
          ]
        },
        include: {
          image: true
        }
      });
    }),
  getImageById: protectedProcedure.input(z.object({ id: z.string().cuid() })).query(async ({ ctx, input }) => {
    const image = await ctx.db.image.findUnique({
      where: { id: input.id },
      include: {
        imageForEntities: {
          include: {
            product: true,
            banner: true,
            user: true,
            restaurant: true,
            subCategory: true
          }
        }
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
          imageForEntities: {
            include: {
              product: true,
              banner: true,
              user: true,
              restaurant: true,
              subCategory: true
            }
          }
        }
      });

      return enrichImageWithAssociations(updated);
    }),

  detachImageFromEntity: protectedProcedure
    .input(
      z.object({
        imageId: z.string().cuid(),
        entityId: z.string(),
        entityType: z.nativeEnum(EntityType)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { imageId, entityId, entityType } = input;

      const image = await ctx.db.image.findUnique({
        where: { id: imageId },
        include: {
          imageForEntities: {
            include: {
              product: true,
              banner: true,
              user: true,
              restaurant: true,
              subCategory: true
            }
          }
        }
      });

      if (!image) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Image not found'
        });
      }

      const detachData: Prisma.ImageForEntityDeleteArgs = { where: { id: '' } };

      switch (entityType) {
        case EntityType.PRODUCT:
          detachData.where = {
            productId: entityId,
            imageId
          } as any;
        case EntityType.CATEGORY:
          detachData.where = {
            subCategoryId: entityId,
            imageId
          };
          break;
        case EntityType.BANNER:
          detachData.where = {
            bannerId: entityId,
            imageId
          } as any;
          break;
        case EntityType.USER:
          detachData.where = {
            userId: entityId,
            imageId
          };
          break;
        case EntityType.RESTAURANT:
          detachData.where = {
            restaurantId: entityId,
            imageId
          };
          break;
      }

      const deleted = await ctx.db.imageForEntity.delete({
        ...detachData
      });

      return enrichImageWithAssociations(deleted);
    }),

  detachAllAssociations: protectedProcedure
    .input(z.object({ imageId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const image = await ctx.db.image.findUnique({
        where: { id: input.imageId }
      });

      if (!image) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Image not found'
        });
      }

      const deleted = await ctx.db.imageForEntity.deleteMany({
        where: { imageId: input.imageId }
      });

      return enrichImageWithAssociations(deleted);
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
              {
                imageForEntities: {
                  some: {}
                }
              }
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
              imageForEntityId: z.string().optional(),
              altText: z.string(),
              type: z.nativeEnum(ImageType),
              mode: z.enum(['connect', 'disconnect']).default('connect')
            })
          )
          .default([])
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { entityId, entityType, images } = input;
      if (!entityId || !images) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Du lieu khong hop le.' });

      switch (entityType) {
        case EntityType.PRODUCT:
          const product = await ctx.db.product.findUnique({
            where: { id: entityId },
            include: { imageForEntities: { include: { image: true } } }
          });

          if (product) {
            const existingThumbnail = images?.some(i => i.type === ImageType.THUMBNAIL)
              ? product?.imageForEntities?.find(item => item?.type === ImageType.THUMBNAIL)
              : null;
            return await ctx.db.$transaction([
              ...(existingThumbnail
                ? [
                    ctx.db.imageForEntity.deleteMany({
                      where: {
                        id: existingThumbnail?.id
                      }
                    })
                  ]
                : []),
              ...images
                .map(img => {
                  if (img.mode === 'connect') {
                    return ctx.db.imageForEntity.upsert({
                      where: {
                        id: img?.imageForEntityId || 'default'
                      },
                      create: {
                        altText: img.altText || 'Ảnh ' + img.type + ' của sản phẩm ' + product.name,
                        type: img.type,
                        entityType,
                        product: {
                          connect: {
                            id: product?.id
                          }
                        },
                        image: {
                          connect: {
                            id: img.id
                          }
                        }
                      },
                      update: {
                        altText: img.altText || 'Ảnh ' + img.type + ' của sản phẩm ' + product.name,
                        type: img.type,
                        entityType,
                        product: {
                          connect: {
                            id: product?.id
                          }
                        },
                        image: {
                          connect: {
                            id: img.id
                          }
                        }
                      }
                    });
                  } else {
                    return ctx.db.imageForEntity.deleteMany({
                      where: {
                        id: img?.imageForEntityId || 'default'
                      }
                    });
                  }
                })
                .filter(Boolean)
            ]);
          }
          return;
        case EntityType.BANNER:
          const banner = await getOneBannerService(ctx.db, { isActive: true });
          if (banner) {
            return await ctx.db.$transaction(
              images
                .map(img => {
                  if (img.mode === 'connect') {
                    return ctx.db.imageForEntity.upsert({
                      where: {
                        id: img?.imageForEntityId || 'default'
                      },
                      create: {
                        altText: img.altText || 'Ảnh ' + img.type + ' của nhà hàng ',
                        type: img.type,
                        entityType,
                        banner: {
                          connect: {
                            id: banner?.id
                          }
                        },
                        image: {
                          connect: {
                            id: img.id
                          }
                        }
                      },
                      update: {
                        altText: img.altText || 'Ảnh ' + img.type + ' của nhà hàng',
                        type: img.type,
                        entityType,
                        banner: {
                          connect: {
                            id: banner?.id
                          }
                        },
                        image: {
                          connect: {
                            id: img.id
                          }
                        }
                      }
                    });
                  } else {
                    return ctx.db.imageForEntity.delete({
                      where: {
                        id: img?.imageForEntityId || 'default'
                      }
                    });
                  }
                })
                .filter(Boolean)
            );
          }
          return;

        case EntityType.CATEGORY:
          const subCategory = await ctx.db.subCategory.findUnique({ where: { id: entityId } });
          if (subCategory) {
            return await ctx.db.$transaction(
              images
                .map(img => {
                  if (img.mode === 'connect') {
                    return ctx.db.imageForEntity.upsert({
                      where: {
                        id: img?.imageForEntityId || 'default_id'
                      },
                      create: {
                        altText: img.altText || 'Ảnh ' + img.type + ' của danh mục ' + subCategory.name,
                        type: img.type,
                        entityType,
                        subCategory: {
                          connect: {
                            id: entityId
                          }
                        },
                        image: {
                          connect: {
                            id: img.id
                          }
                        }
                      },
                      update: {
                        altText: img.altText || 'Ảnh ' + img.type + ' của danh mục ' + subCategory.name,
                        type: img.type,
                        entityType,
                        subCategory: {
                          connect: {
                            id: entityId
                          }
                        },
                        image: {
                          connect: {
                            id: img.id
                          }
                        }
                      }
                    });
                  } else {
                    return ctx.db.imageForEntity.delete({
                      where: {
                        id: img?.imageForEntityId || 'default'
                      }
                    });
                  }
                })
                .filter(Boolean)
            );
          }
          return;

        case EntityType.USER:
          const user = await getOneUserService(ctx.db, { s: entityId });
          if (user) {
            return await ctx.db.$transaction(
              images
                .map(img => {
                  if (img.mode === 'connect') {
                    return ctx.db.imageForEntity.upsert({
                      where: {
                        id: img?.imageForEntityId || 'default_id'
                      },
                      create: {
                        altText: img.altText || 'Ảnh ' + img.type + ' của người dùng' + (user?.name ?? ''),
                        type: img.type,
                        entityType,
                        user: {
                          connect: {
                            id: entityId
                          }
                        },
                        image: {
                          connect: {
                            id: img.id
                          }
                        }
                      },
                      update: {
                        altText: img.altText || 'Ảnh ' + img.type + ' của danh mục ' + (user?.name ?? ''),
                        type: img.type,
                        entityType,
                        user: {
                          connect: {
                            id: entityId
                          }
                        },
                        image: {
                          connect: {
                            id: img.id
                          }
                        }
                      }
                    });
                  } else {
                    return ctx.db.imageForEntity.delete({
                      where: {
                        id: img?.imageForEntityId || 'default'
                      }
                    });
                  }
                })
                .filter(Boolean)
            );
          }
          return;
        case EntityType.RESTAURANT:
          const restaurant = await getOneActiveClientService(ctx.db);
          if (restaurant) {
            return await ctx.db.$transaction(
              images
                .map(img => {
                  if (img.mode === 'connect') {
                    return ctx.db.imageForEntity.upsert({
                      where: {
                        id: img?.imageForEntityId || 'default_id'
                      },
                      create: {
                        altText: img.altText || 'Ảnh ' + img.type + ' của nhà hàng' + (user?.name ?? ''),
                        type: img.type,
                        entityType,
                        restaurant: {
                          connect: {
                            id: entityId
                          }
                        },
                        image: {
                          connect: {
                            id: img.id
                          }
                        }
                      },
                      update: {
                        altText: img.altText || 'Ảnh ' + img.type + ' của nhà hàng ' + (user?.name ?? ''),
                        type: img.type,
                        entityType,
                        restaurant: {
                          connect: {
                            id: entityId
                          }
                        },
                        image: {
                          connect: {
                            id: img.id
                          }
                        }
                      }
                    });
                  } else {
                    return ctx.db.imageForEntity.delete({
                      where: {
                        id: img?.imageForEntityId || 'default'
                      }
                    });
                  }
                })
                .filter(Boolean)
            );
          }
          return;
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

  if (image && image?.imageForEntities) {
    image?.imageForEntities?.map((img: any) => {
      if (img.product) {
        associations.push({
          type: EntityType.PRODUCT,
          name: img.product.name,
          id: img.product.id,
          label: `Product: ${img.product.name}`
        });
      }

      if (img.banner) {
        associations.push({
          type: EntityType.BANNER,
          name: img.banner.title || 'Untitled Banner',
          id: img.banner.id,
          label: `Banner: ${img.banner.title || 'Untitled'}`
        });
      }

      if (img.user) {
        associations.push({
          type: EntityType.USER,
          name: img.user.name || img.user.email,
          id: img.user.id,
          label: `User: ${img.user.name || img.user.email}`
        });
      }

      if (img.restaurant) {
        associations.push({
          type: EntityType.RESTAURANT,
          name: img.restaurant.name,
          id: img.restaurant.id,
          label: `Restaurant: ${img.restaurant.name}`
        });
      }

      if (img.subCategory) {
        associations.push({
          type: EntityType.CATEGORY,
          name: img.subCategory.name,
          id: img.subCategory.id,
          label: `Category: ${img.subCategory.name}`
        });
      }
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
