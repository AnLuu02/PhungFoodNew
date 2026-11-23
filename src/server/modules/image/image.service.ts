import { EntityType, ImageType, Prisma, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import cloudinary from '~/lib/Cloudinary/cloudinary';
import { ImageServerInput } from '~/shared/schema/image.schema';
import { ImageAssociation, ImageWithAssociationInput, ImageWithAssociations } from '~/shared/types/image.types';
import { getServerAuthSession } from '~/server/auth';
import { getOneBannerService } from '~/server/modules/restaurant/restaurant.banner.service';
import { getRestaurantOnlyService } from '~/server/modules/restaurant/restaurant.service';
import { getOneUserService } from '~/server/modules/user/user.service';

const ENTITY_RELATION_MAP: Partial<
  Record<EntityType, { type: 'N_TO_N'; fkField: string; selectField: string } | { type: 'DIRECT'; fieldName: string }>
> = {
  [EntityType.PRODUCT]: { type: 'N_TO_N', fkField: 'productId', selectField: 'product' },
  [EntityType.BANNER]: { type: 'N_TO_N', fkField: 'bannerId', selectField: 'banner' },
  [EntityType.CATEGORY]: { type: 'DIRECT', fieldName: 'subCategories' },
  [EntityType.USER]: { type: 'DIRECT', fieldName: 'users' },
  [EntityType.RESTAURANT]: { type: 'DIRECT', fieldName: 'restaurants' }
};

export const checkExistingImageService = async (db: PrismaClient, input: { publicId: string }) => {
  const existingImage = await db.image.findUnique({
    where: { publicId: input.publicId }
  });

  return {
    exists: !!existingImage,
    image: existingImage ?? null
  };
};

export const deleteImageService = async (db: PrismaClient, input: { publicId: string }) => {
  const { publicId } = input;
  if (!publicId) throw new TRPCError({ code: 'NOT_FOUND', message: 'Không có ảnh phù hợp.' });
  const deleted = await db.image.delete({
    where: {
      publicId: input.publicId
    }
  });
  if (deleted?.publicId) {
    cloudinary.uploader
      .destroy(deleted?.publicId)
      .catch(() => console.error('Xóa ảnh khỏi cloudinary không thành công. Hãy kiểm tra lại.'));
  }
  return {
    metaData: {
      before: deleted ?? {},
      after: {}
    }
  };
};

export const upsertImageService = async (db: PrismaClient, input: ImageServerInput) => {
  const { id, ...data } = input;
  const result = await db.$transaction(async tx => {
    const oldData = id ? await tx.image.findUnique({ where: { id } }) : null;
    const newData = await tx.image.upsert({
      where: {
        id: String(id)
      },
      create: {
        ...data,
        url: data?.url || '',
        type: ImageType.OTHER
      },
      update: data
    });
    return { oldData, newData };
  });

  return {
    metaData: {
      before: result.oldData ?? {},
      after: result.newData
    }
  };
};

const FILTER_ENTITY_MAP: Record<EntityType, Prisma.ImageWhereInput> = {
  [EntityType.PRODUCT]: {
    imageForEntities: {
      some: {
        entityType: EntityType.PRODUCT
      }
    }
  },
  [EntityType.BANNER]: {
    imageForEntities: {
      some: {
        entityType: EntityType.BANNER
      }
    }
  },

  [EntityType.USER]: {
    users: {
      some: {
        avatarImageId: { not: null }
      }
    }
  },

  [EntityType.CATEGORY]: {
    subCategories: {
      some: {
        imageId: { not: null }
      }
    }
  },

  [EntityType.RESTAURANT]: {
    restaurants: {
      some: {
        logoImageId: { not: null }
      }
    }
  },
  [EntityType.UNASSIGNED]: {
    imageForEntities: {
      none: {}
    },
    users: {
      none: {}
    },
    restaurants: { none: {} },
    subCategories: { none: {} }
  }
};

export const findImageService = async (
  db: PrismaClient,
  input: {
    imageType?: ImageType;
    entityType?: EntityType;
    showOrphanedOnly?: boolean;
    searchQuery?: string;
    skip: number;
    take: number;
  }
) => {
  const { imageType, entityType, showOrphanedOnly, searchQuery, skip, take } = input;

  const where: Prisma.ImageWhereInput = {
    AND: [
      entityType ? FILTER_ENTITY_MAP[entityType] : {},
      {
        url: {
          contains: 'res.cloudinary.com'
        }
      },
      imageType
        ? {
            OR: [
              {
                type: imageType
              },
              {
                imageForEntities: {
                  some: {
                    type: imageType
                  }
                }
              }
            ]
          }
        : {},
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
              none: {}
            }
          }
        : {}
    ]
  };

  const [images, total] = await db.$transaction([
    db.image.findMany({
      where,
      include: {
        users: true,
        restaurants: true,
        subCategories: true,
        imageForEntities: {
          include: {
            product: true,
            banner: true
          }
        }
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    }),
    db.image.count({ where })
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
};

export const getImageForEntityService = async (
  db: PrismaClient,
  input: {
    entityId: string;
    include?: Prisma.ImageInclude;
  }
) => {
  const { entityId, include } = input;
  return await db.imageForEntity.findMany({
    where: {
      OR: [
        {
          bannerId: entityId
        },
        {
          productId: entityId
        }
      ]
    },
    include: { ...(include ?? {}), image: true }
  });
};

export const getImageByIdService = async (
  db: PrismaClient,
  input: {
    id: string;
  }
) => {
  const image = await db.image.findUnique({
    where: { id: input.id },
    include: {
      users: true,
      restaurants: true,
      subCategories: true,
      imageForEntities: {
        include: {
          product: true,
          banner: true
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
};

export const updateImageMetadataService = async (
  db: PrismaClient,
  input: { id: string; altText?: string; type?: ImageType }
) => {
  const { id, altText, type } = input;

  const updated = await db.image.update({
    where: { id },
    data: {
      ...(altText !== undefined && { altText }),
      ...(type !== undefined && { type }),
      updatedAt: new Date()
    },
    include: {
      users: true,
      restaurants: true,
      subCategories: true,
      imageForEntities: {
        include: {
          product: true,
          banner: true
        }
      }
    }
  });

  return enrichImageWithAssociations(updated);
};

function isOneToManyOnImage(fieldName: string): boolean {
  const imageModel = Prisma.dmmf.datamodel.models.find(m => m.name === 'Image');
  const field = imageModel?.fields.find(f => f.name === fieldName);
  return Boolean(field?.isList);
}

export const detachImageFromEntityService = async (
  db: PrismaClient,
  input: {
    imageId: string;
    imageForEntityId: string;
    entityId: string;
    entityType: EntityType;
  }
) => {
  const { imageId, imageForEntityId, entityId, entityType } = input;

  if (entityType === EntityType.UNASSIGNED) {
    const currentImage = await db.image.findUnique({ where: { id: imageId } });
    if (!currentImage) throw new TRPCError({ code: 'NOT_FOUND', message: 'Image not found' });
    return enrichImageWithAssociations(currentImage);
  }

  const config = ENTITY_RELATION_MAP[entityType];
  if (!config) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Loại thực thể không được hỗ trợ' });
  }

  const include: Prisma.ImageInclude =
    config.type === 'N_TO_N'
      ? { imageForEntities: { select: { [config.selectField]: true } } }
      : { [config.fieldName]: true };

  const image = await db.image.findUnique({
    where: { id: imageId },
    include
  });

  if (!image) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Image not found' });
  }

  let detached;

  if (config.type === 'N_TO_N') {
    detached = await db.$transaction(async tx => {
      await tx.imageForEntity.delete({
        where: {
          id: imageForEntityId,
          [config.fkField]: entityId,
          imageId
        }
      });
      return tx.image.findUnique({
        where: { id: imageId },
        include
      });
    });
  } else {
    const isList = isOneToManyOnImage(config.fieldName);

    detached = await db.image.update({
      where: { id: imageId },
      data: {
        [config.fieldName]: {
          disconnect: isList ? { id: entityId } : true
        }
      },
      include
    });
  }

  if (!detached) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Không thể gỡ liên kết. Thử lại sau.' });
  }

  return enrichImageWithAssociations(detached);
};

export const detachAllAssociationsService = async (db: PrismaClient, input: { imageId: string }) => {
  const { imageId } = input;
  const image = await db.image.findUnique({
    where: { id: imageId }
  });

  if (!image) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Image not found'
    });
  }

  const detached = await db.$transaction(async tx => {
    await Promise.all([
      tx.imageForEntity.deleteMany({
        where: {
          imageId
        }
      }),
      tx.image.update({
        where: {
          id: imageId
        },
        data: {
          users: { set: [] },
          restaurants: { set: [] },
          subCategories: { set: [] }
        }
      })
    ]);
    return await db.image.findUnique({
      where: { id: input.imageId }
    });
  });

  if (!detached) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Không thể gỡ liên kết. Thử lại sau.' });
  return enrichImageWithAssociations(detached);
};

export const bulkDeleteImagesService = async (
  db: PrismaClient,
  input: {
    imageIds: string[];
    deleteOrphaned?: boolean;
  }
) => {
  const { imageIds, deleteOrphaned } = input;

  if (!deleteOrphaned) {
    const associatedImages = await db.image.findMany({
      where: {
        id: { in: imageIds },
        OR: [
          {
            imageForEntities: {
              some: {}
            }
          },
          {
            users: {
              some: {}
            }
          },
          {
            restaurants: {
              some: {}
            }
          },
          {
            subCategories: {
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

  await deleteFromCloudinary(db, imageIds);

  const deleted = await db.image.deleteMany({
    where: { id: { in: imageIds } }
  });

  return {
    success: true,
    deletedCount: deleted.count
  };
};

export const bulkUpdateImageTypeService = async (
  db: PrismaClient,
  input: {
    imageIds: string[];
    newType: ImageType;
  }
) => {
  const { imageIds, newType } = input;

  const updated = await db.image.updateMany({
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
};

export const connectedEntityService = async (
  db: PrismaClient,
  input: {
    entityId: string;
    entityType: EntityType;
    images: {
      id: string;
      imageForEntityId?: string;
      altText: string;
      type: ImageType;
      mode: 'connect' | 'disconnect';
    }[];
  }
) => {
  const { entityId, entityType, images } = input;
  const session = await getServerAuthSession();

  if (!entityId || !images)
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Dữ liệu đầu vào không hợp lệ. Hãy kiểm tra entityId và images truyền vào'
    });

  switch (entityType) {
    case EntityType.PRODUCT:
      const product = await db.product.findUnique({
        where: { id: entityId },
        include: { imageForEntities: { include: { image: true } } }
      });

      if (product) {
        const existingThumbnail = images?.some(i => i.type === ImageType.THUMBNAIL)
          ? product?.imageForEntities?.find(item => item?.type === ImageType.THUMBNAIL)
          : null;
        return await db.$transaction([
          ...(existingThumbnail
            ? [
                db.imageForEntity.deleteMany({
                  where: {
                    id: existingThumbnail?.id
                  }
                })
              ]
            : []),
          ...images
            .map(img => {
              if (img.mode === 'connect') {
                return db.imageForEntity.upsert({
                  where: {
                    id: String(img?.imageForEntityId)
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
                return db.imageForEntity.deleteMany({
                  where: {
                    id: String(img?.imageForEntityId)
                  }
                });
              }
            })
            .filter(Boolean)
        ]);
      }
      return;
    case EntityType.BANNER:
      const banner = await getOneBannerService(db, session);
      if (banner) {
        return await db.$transaction(
          images
            .map(img => {
              if (img.mode === 'connect') {
                return db.imageForEntity.upsert({
                  where: {
                    id: String(img?.imageForEntityId)
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
                return db.imageForEntity.delete({
                  where: {
                    id: String(img?.imageForEntityId)
                  }
                });
              }
            })
            .filter(Boolean)
        );
      }
      return;

    case EntityType.CATEGORY:
      const subCategory = await db.subCategory.findUnique({ where: { id: entityId } });
      if (subCategory) {
        return await db.$transaction(
          images.map(img => {
            return db.image.update({
              where: {
                id: String(img.id)
              },
              data: {
                subCategories: {
                  ...(img.mode === 'connect' ? { connect: { id: entityId } } : { disconnect: { id: entityId } }),
                  update: {
                    where: { id: entityId },
                    data: {
                      ...(img.mode === 'connect'
                        ? {
                            imageAltText: 'Ảnh mô tả danh mục ' + subCategory.name
                          }
                        : { imageAltText: null })
                    }
                  }
                }
              }
            });
          })
        );
      }
      return;

    case EntityType.USER:
      const user = await getOneUserService(db, { key: entityId });
      if (user) {
        return await db.$transaction(
          images.map(img => {
            return db.image.update({
              where: {
                id: String(img.id)
              },
              data: {
                users: {
                  ...(img.mode === 'connect' ? { connect: { id: entityId } } : { disconnect: { id: entityId } })
                }
              }
            });
          })
        );
      }
      return;

    case EntityType.RESTAURANT:
      const restaurant = await getRestaurantOnlyService(db);
      if (restaurant) {
        return await db.$transaction(
          images.map(img => {
            return db.image.update({
              where: {
                id: String(img.id)
              },
              data: {
                restaurants: {
                  ...(img.mode === 'connect' ? { connect: { id: entityId } } : { disconnect: { id: entityId } })
                }
              }
            });
          })
        );
      }
      return;
    default:
      return;
  }
};
export const deleteFromCloudinary = async (db: PrismaClient, imageIds: string[]) => {
  const publicIds = await db.image.findMany({
    where: { id: { in: imageIds } },
    select: { publicId: true }
  });
  for (const { publicId } of publicIds) {
    if (publicId) await cloudinary.api.delete_resources([publicId]);
  }
};

export function enrichImageWithAssociations(image: ImageWithAssociationInput): ImageWithAssociations {
  const associations: ImageAssociation[] = [];

  if (image && image?.imageForEntities) {
    image?.imageForEntities?.map(imgForEntity => {
      if (imgForEntity?.product) {
        associations.push({
          id: imgForEntity.product.id,
          imageForEntityId: imgForEntity.id,
          type: EntityType.PRODUCT,
          name: imgForEntity.product.name,
          label: `Product: ${imgForEntity.product.name}`
        });
      }

      if (imgForEntity?.banner) {
        associations.push({
          id: imgForEntity.banner.id,
          imageForEntityId: imgForEntity.id,
          type: EntityType.BANNER,
          name: imgForEntity.altText || 'Untitled Banner',
          label: `Banner: ${imgForEntity.altText || 'Untitled'}`
        });
      }
    });
  }
  if (image?.users && Array.isArray(image?.users)) {
    image?.users.map(user =>
      associations.push({
        id: user.id,
        imageForEntityId: '',
        type: EntityType.USER,
        name: user.name || user.email,
        label: `User: ${user.name || user.email}`
      })
    );
  }
  if (image?.restaurants && Array.isArray(image?.restaurants)) {
    image?.restaurants.map(restaurant =>
      associations.push({
        id: restaurant.id,
        imageForEntityId: '',
        type: EntityType.RESTAURANT,
        name: restaurant.name,
        label: `Restaurant: ${restaurant.name}`
      })
    );
  }
  if (image?.subCategories && Array.isArray(image?.subCategories)) {
    image?.subCategories.map(subCategory =>
      associations.push({
        id: subCategory.id,
        imageForEntityId: '',
        type: EntityType.CATEGORY,
        name: subCategory.name,
        label: `Category: ${subCategory.name}`
      })
    );
  }

  return {
    ...image,
    associations,
    isOrphaned: associations.length === 0,
    usageCount: associations.length
  };
}
