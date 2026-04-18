import { ImageType, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import cloudinary from '~/lib/Cloudinary/cloudinary';
import { ImageFromDb } from '~/shared/schema/image.schema';

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
  return deleted;
};

export const upsertImageService = async (db: PrismaClient, input: ImageFromDb) => {
  const { id, ...data } = input;
  return await db.image.upsert({
    where: {
      id: id || 'Default_image_id'
    },
    create: {
      ...data,
      url: data?.url || '',
      type: ImageType.OTHER
    },
    update: data
  });
};

export const bulkUpsertImageService = async (db: PrismaClient, input: ImageFromDb[]) => {
  if (!input || input?.length <= 0)
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Giá trị đầu vào không hợp lệ.' });
  return await db.$transaction(
    input.map(({ id, ...rest }, index) =>
      db.image.upsert({
        where: {
          id: id || 'default_id_image' + index
        },
        create: {
          ...rest,
          url: rest?.url || '',
          type: ImageType.OTHER
        },
        update: rest
      })
    )
  );
};

// export const getAllImagesService = async (db: PrismaClient, input: any) => {
//   const { imageTypes, entityTypes, showOrphanedOnly, searchQuery, skip, take } = input;

//   const where: Prisma.ImageWhereInput = {
//     AND: [
//       imageTypes?.length ? { type: { in: imageTypes } } : {},
//       searchQuery
//         ? {
//             OR: [
//               { altText: { contains: searchQuery, mode: 'insensitive' } },
//               { url: { contains: searchQuery, mode: 'insensitive' } }
//             ]
//           }
//         : {},
//       showOrphanedOnly
//         ? {
//             imageForEntities: {
//               some: {}
//             }
//           }
//         : {}
//     ]
//   };

//   const [images, total] = await db.$transaction([
//     db.image.findMany({
//       where,
//       include: {
//         imageForEntities: {
//           include: {
//             product: true,
//             banner: true,
//             user: true,
//             restaurant: true,
//             subCategory: true
//           }
//         }
//       },
//       skip,
//       take,
//       orderBy: { createdAt: 'desc' }
//     }),
//     db.image.count({ where })
//   ]);
//   return {
//     data: images.map(img => enrichImageWithAssociations(img)),
//     total,
//     pageInfo: {
//       skip,
//       take,
//       hasMore: skip + take < total
//     }
//   };
// };
// export const getImageForEntityService = async (db: PrismaClient, input: any) => {
//   const { entityId } = input;
//   return await db.imageForEntity.findMany({
//     where: {
//       OR: [
//         {
//           subCategoryId: entityId
//         },
//         {
//           bannerId: entityId
//         },
//         {
//           restaurantId: entityId
//         },
//         {
//           productId: entityId
//         },
//         {
//           userId: entityId
//         }
//       ]
//     },
//     include: {
//       image: true
//     }
//   });
// };
// export const getImageByIdService = async (db: PrismaClient, input: any) => {
//   const image = await db.image.findUnique({
//     where: { id: input.id },
//     include: {
//       imageForEntities: {
//         include: {
//           product: true,
//           banner: true,
//           user: true,
//           restaurant: true,
//           subCategory: true
//         }
//       }
//     }
//   });

//   if (!image) {
//     throw new TRPCError({
//       code: 'NOT_FOUND',
//       message: 'Image not found'
//     });
//   }

//   return enrichImageWithAssociations(image);
// };

// export const updateImageMetadataService = async (db: PrismaClient, input: any) => {
//   const { id, altText, type } = input;

//   const updated = await db.image.update({
//     where: { id },
//     data: {
//       ...(altText !== undefined && { altText }),
//       ...(type !== undefined && { type }),
//       updatedAt: new Date()
//     },
//     include: {
//       imageForEntities: {
//         include: {
//           product: true,
//           banner: true,
//           user: true,
//           restaurant: true,
//           subCategory: true
//         }
//       }
//     }
//   });

//   return enrichImageWithAssociations(updated);
// };

// export const detachImageFromEntityService = async (db: PrismaClient, input: any) => {
//   const { imageId, entityId, entityType } = input;

//   const image = await db.image.findUnique({
//     where: { id: imageId },
//     include: {
//       imageForEntities: {
//         include: {
//           product: true,
//           banner: true,
//           user: true,
//           restaurant: true,
//           subCategory: true
//         }
//       }
//     }
//   });

//   if (!image) {
//     throw new TRPCError({
//       code: 'NOT_FOUND',
//       message: 'Image not found'
//     });
//   }

//   const detachData: Prisma.ImageForEntityDeleteArgs = { where: { id: '' } };

//   switch (entityType) {
//     case EntityType.PRODUCT:
//       detachData.where = {
//         productId: entityId,
//         imageId
//       } as any;
//     case EntityType.CATEGORY:
//       detachData.where = {
//         subCategoryId: entityId,
//         imageId
//       };
//       break;
//     case EntityType.BANNER:
//       detachData.where = {
//         bannerId: entityId,
//         imageId
//       } as any;
//       break;
//     case EntityType.USER:
//       detachData.where = {
//         userId: entityId,
//         imageId
//       };
//       break;
//     case EntityType.RESTAURANT:
//       detachData.where = {
//         restaurantId: entityId,
//         imageId
//       };
//       break;
//   }

//   const deleted = await db.imageForEntity.delete({
//     ...detachData
//   });

//   return enrichImageWithAssociations(deleted);
// };

// export const detachAllAssociationsService = async (db: PrismaClient, input: any) => {
//   const image = await db.image.findUnique({
//     where: { id: input.imageId }
//   });

//   if (!image) {
//     throw new TRPCError({
//       code: 'NOT_FOUND',
//       message: 'Image not found'
//     });
//   }

//   const deleted = await db.imageForEntity.deleteMany({
//     where: { imageId: input.imageId }
//   });

//   return enrichImageWithAssociations(deleted);
// };

// export const bulkDeleteImagesService = async (db: PrismaClient, input: any) => {
//   const { imageIds, deleteOrphaned } = input;

//   if (!deleteOrphaned) {
//     const associatedImages = await db.image.findMany({
//       where: {
//         id: { in: imageIds },
//         OR: [
//           {
//             imageForEntities: {
//               some: {}
//             }
//           }
//         ]
//       }
//     });

//     if (associatedImages.length > 0) {
//       throw new TRPCError({
//         code: 'CONFLICT',
//         message: `${associatedImages.length} image(s) are still associated with entities. Detach them first or use deleteOrphaned flag.`
//       });
//     }
//   }

//   await deleteFromCloudinary(imageIds, ctx);

//   const deleted = await db.image.deleteMany({
//     where: { id: { in: imageIds } }
//   });

//   return {
//     success: true,
//     deletedCount: deleted.count
//   };
// };

// export const bulkUpdateImageTypeService = async (db: PrismaClient, input: any) => {
//   const { imageIds, newType } = input;

//   const updated = await db.image.updateMany({
//     where: { id: { in: imageIds } },
//     data: {
//       type: newType,
//       updatedAt: new Date()
//     }
//   });

//   return {
//     success: true,
//     updatedCount: updated.count
//   };
// };

// export const getEnumOptionsService = async (db: PrismaClient, input: any) => {
//   return {
//     imageTypes: Object.values(ImageType),
//     entityTypes: Object.values(EntityType)
//   };
// };
// export const connectedEntityService = async (db: PrismaClient, input: any) => {
//   const { entityId, entityType, images } = input;
//   if (!entityId || !images) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Du lieu khong hop le.' });

//   switch (entityType) {
//     case EntityType.PRODUCT:
//       const product = await db.product.findUnique({ where: { id: entityId } });
//       if (product) {
//         return await db.$transaction(
//           images
//             .map(img => {
//               if (img.mode === 'connect') {
//                 return db.imageForEntity.upsert({
//                   where: {
//                     id: img?.imageForEntityId || 'default'
//                   },
//                   create: {
//                     altText: img.altText || 'Ảnh ' + img.type + ' của sản phẩm ' + product.name,
//                     type: img.type,
//                     entityType,
//                     product: {
//                       connect: {
//                         id: product?.id
//                       }
//                     },
//                     image: {
//                       connect: {
//                         id: img.id
//                       }
//                     }
//                   },
//                   update: {
//                     altText: img.altText || 'Ảnh ' + img.type + ' của sản phẩm ' + product.name,
//                     type: img.type,
//                     entityType,
//                     product: {
//                       connect: {
//                         id: product?.id
//                       }
//                     },
//                     image: {
//                       connect: {
//                         id: img.id
//                       }
//                     }
//                   }
//                 });
//               } else {
//                 return db.imageForEntity.delete({
//                   where: {
//                     id: img?.imageForEntityId || 'default'
//                   }
//                 });
//               }
//             })
//             .filter(Boolean)
//         );
//       }
//       return;
//     case EntityType.BANNER:
//       const banner = await getOneBannerService(db, { isActive: true });
//       if (banner) {
//         return await db.$transaction(
//           images
//             .map(img => {
//               if (img.mode === 'connect') {
//                 return db.imageForEntity.upsert({
//                   where: {
//                     id: img?.imageForEntityId || 'default'
//                   },
//                   create: {
//                     altText: img.altText || 'Ảnh ' + img.type + ' của nhà hàng ',
//                     type: img.type,
//                     entityType,
//                     banner: {
//                       connect: {
//                         id: banner?.id
//                       }
//                     },
//                     image: {
//                       connect: {
//                         id: img.id
//                       }
//                     }
//                   },
//                   update: {
//                     altText: img.altText || 'Ảnh ' + img.type + ' của nhà hàng',
//                     type: img.type,
//                     entityType,
//                     banner: {
//                       connect: {
//                         id: banner?.id
//                       }
//                     },
//                     image: {
//                       connect: {
//                         id: img.id
//                       }
//                     }
//                   }
//                 });
//               } else {
//                 return db.imageForEntity.delete({
//                   where: {
//                     id: img?.imageForEntityId || 'default'
//                   }
//                 });
//               }
//             })
//             .filter(Boolean)
//         );
//       }
//       return;

//     case EntityType.CATEGORY:
//       const subCategory = await db.subCategory.findUnique({ where: { id: entityId } });
//       if (subCategory) {
//         return await db.$transaction(
//           images
//             .map(img => {
//               if (img.mode === 'connect') {
//                 return db.imageForEntity.upsert({
//                   where: {
//                     id: img?.imageForEntityId || 'default_id'
//                   },
//                   create: {
//                     altText: img.altText || 'Ảnh ' + img.type + ' của danh mục ' + subCategory.name,
//                     type: img.type,
//                     entityType,
//                     subCategory: {
//                       connect: {
//                         id: entityId
//                       }
//                     },
//                     image: {
//                       connect: {
//                         id: img.id
//                       }
//                     }
//                   },
//                   update: {
//                     altText: img.altText || 'Ảnh ' + img.type + ' của danh mục ' + subCategory.name,
//                     type: img.type,
//                     entityType,
//                     subCategory: {
//                       connect: {
//                         id: entityId
//                       }
//                     },
//                     image: {
//                       connect: {
//                         id: img.id
//                       }
//                     }
//                   }
//                 });
//               } else {
//                 return db.imageForEntity.delete({
//                   where: {
//                     id: img?.imageForEntityId || 'default'
//                   }
//                 });
//               }
//             })
//             .filter(Boolean)
//         );
//       }
//       return;

//     case EntityType.USER:
//       const user = await getOneUserService(db, { s: entityId });
//       if (user) {
//         return await db.$transaction(
//           images
//             .map(img => {
//               if (img.mode === 'connect') {
//                 return db.imageForEntity.upsert({
//                   where: {
//                     id: img?.imageForEntityId || 'default_id'
//                   },
//                   create: {
//                     altText: img.altText || 'Ảnh ' + img.type + ' của người dùng' + (user?.name ?? ''),
//                     type: img.type,
//                     entityType,
//                     user: {
//                       connect: {
//                         id: entityId
//                       }
//                     },
//                     image: {
//                       connect: {
//                         id: img.id
//                       }
//                     }
//                   },
//                   update: {
//                     altText: img.altText || 'Ảnh ' + img.type + ' của danh mục ' + (user?.name ?? ''),
//                     type: img.type,
//                     entityType,
//                     user: {
//                       connect: {
//                         id: entityId
//                       }
//                     },
//                     image: {
//                       connect: {
//                         id: img.id
//                       }
//                     }
//                   }
//                 });
//               } else {
//                 return db.imageForEntity.delete({
//                   where: {
//                     id: img?.imageForEntityId || 'default'
//                   }
//                 });
//               }
//             })
//             .filter(Boolean)
//         );
//       }
//       return;
//     case EntityType.RESTAURANT:
//       const restaurant = await getOneActiveClientService(db);
//       if (restaurant) {
//         return await db.$transaction(
//           images
//             .map(img => {
//               if (img.mode === 'connect') {
//                 return db.imageForEntity.upsert({
//                   where: {
//                     id: img?.imageForEntityId || 'default_id'
//                   },
//                   create: {
//                     altText: img.altText || 'Ảnh ' + img.type + ' của nhà hàng' + (user?.name ?? ''),
//                     type: img.type,
//                     entityType,
//                     restaurant: {
//                       connect: {
//                         id: entityId
//                       }
//                     },
//                     image: {
//                       connect: {
//                         id: img.id
//                       }
//                     }
//                   },
//                   update: {
//                     altText: img.altText || 'Ảnh ' + img.type + ' của nhà hàng ' + (user?.name ?? ''),
//                     type: img.type,
//                     entityType,
//                     restaurant: {
//                       connect: {
//                         id: entityId
//                       }
//                     },
//                     image: {
//                       connect: {
//                         id: img.id
//                       }
//                     }
//                   }
//                 });
//               } else {
//                 return db.imageForEntity.delete({
//                   where: {
//                     id: img?.imageForEntityId || 'default'
//                   }
//                 });
//               }
//             })
//             .filter(Boolean)
//         );
//       }
//       return;
//     default:
//       return;
//   }
// };

// function enrichImageWithAssociations(image: any): ImageWithAssociations {
//   const associations: ImageAssociation[] = [];

//   if (image && image?.imageForEntities) {
//     image?.imageForEntities?.map((img: any) => {
//       if (img.product) {
//         associations.push({
//           type: EntityType.PRODUCT,
//           name: img.product.name,
//           id: img.product.id,
//           label: `Product: ${img.product.name}`
//         });
//       }

//       if (img.banner) {
//         associations.push({
//           type: EntityType.BANNER,
//           name: img.banner.title || 'Untitled Banner',
//           id: img.banner.id,
//           label: `Banner: ${img.banner.title || 'Untitled'}`
//         });
//       }

//       if (img.user) {
//         associations.push({
//           type: EntityType.USER,
//           name: img.user.name || img.user.email,
//           id: img.user.id,
//           label: `User: ${img.user.name || img.user.email}`
//         });
//       }

//       if (img.restaurant) {
//         associations.push({
//           type: EntityType.RESTAURANT,
//           name: img.restaurant.name,
//           id: img.restaurant.id,
//           label: `Restaurant: ${img.restaurant.name}`
//         });
//       }

//       if (img.subCategory) {
//         associations.push({
//           type: EntityType.CATEGORY,
//           name: img.subCategory.name,
//           id: img.subCategory.id,
//           label: `Category: ${img.subCategory.name}`
//         });
//       }
//     });
//   }

//   return {
//     ...image,
//     associations,
//     isOrphaned: associations.length === 0,
//     usageCount: associations.length
//   };
// }
// async function deleteFromCloudinary(imageIds: string[], db: PrismaClient) {
//   const publicIds = await db.image.findMany({
//     where: { id: { in: imageIds } },
//     select: { publicId: true }
//   });
//   for (const { publicId } of publicIds) {
//     if (publicId) await cloudinary.api.delete_resources([publicId]);
//   }
// }
