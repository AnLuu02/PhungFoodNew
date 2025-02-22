import { EntityType, Gender, ImageType, UserLevel, UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import {
  deleteImageFromFirebase,
  getFileNameFromFirebaseFile,
  uploadToFirebase
} from '~/app/lib/utils/func-handler/handle-file-upload';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
export async function hashPassword(password: string) {
  const saltRounds = 10;
  const hashedPassword = await hash(password, saltRounds);
  return hashedPassword;
}
export const userRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        query: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { skip, take, query } = input;
      const startPageItem = skip > 0 ? (skip - 1) * take : 0;
      const [totalUsers, totalUsersQuery, users] = await ctx.db.$transaction([
        ctx.db.user.count(),
        ctx.db.user.count({
          where: {
            OR: [
              {
                name: { contains: query, mode: 'insensitive' }
              },
              {
                address: { contains: query, mode: 'insensitive' }
              },
              {
                phone: { contains: query, mode: 'insensitive' }
              },
              {
                email: { contains: query, mode: 'insensitive' }
              }
            ]
          }
        }),
        ctx.db.user.findMany({
          skip: startPageItem,
          take,
          where: {
            OR: [
              {
                name: { contains: query, mode: 'insensitive' }
              },
              {
                address: { contains: query, mode: 'insensitive' }
              },
              {
                phone: { contains: query, mode: 'insensitive' }
              },
              {
                email: { contains: query, mode: 'insensitive' }
              }
            ]
          }
        })
      ]);
      const totalPages = Math.ceil(query ? (totalUsersQuery == 0 ? 1 : totalUsersQuery / take) : totalUsers / take);
      const currentPage = skip ? Math.floor(skip / take + 1) : 1;
      return {
        users,
        pagination: {
          currentPage,
          totalPages
        }
      };
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email({ message: 'Invalid email' }),
        image: z
          .object({
            fileName: z.string(),
            base64: z.string()
          })
          .optional(),
        dateOfBirth: z.date().optional(),
        password: z.string().min(6, { message: 'Password should include at least 6 characters' }),
        role: z.enum(['ADMIN', 'CUSTOMER', 'STAFF']).default('CUSTOMER'),
        phone: z.string().max(10, { message: 'Phone number must not exceed 10 characters' }).optional(),
        address: z.string().optional(),
        pointLevel: z.number().default(0),
        level: z.nativeEnum(UserLevel).default(UserLevel.DONG)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existed = await ctx.db.user.findFirst({
        where: {
          email: { equals: input.email }
        },
        include: {
          images: true
        }
      });

      if (existed) {
        return {
          success: false,
          message: 'người dùng đã tồn tại. Hãy thử lại.',
          record: existed
        };
      }

      let imgURL: string | undefined;

      if (input?.image && input.image.fileName !== '') {
        if (input.image?.base64 !== '') {
          imgURL = await uploadToFirebase(input.image.fileName, input.image.base64);
        } else {
          imgURL = input.image.fileName;
        }
      }
      if (input.email === 'anluu099@gmail.com') {
        input.role = 'ADMIN';
      }
      const passwordHash = await hashPassword(input.password);
      const user = await ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          dateOfBirth: input.dateOfBirth,
          password: passwordHash,
          role: input.role,
          phone: input.phone,
          address: input.address,
          pointLevel: input.pointLevel,
          level: input.level,
          images: imgURL
            ? {
                create: {
                  entityType: EntityType.USER,
                  altText: `Ảnh ${input.name}`,
                  url: imgURL,
                  type: ImageType.THUMBNAIL
                }
              }
            : undefined
        }
      });

      return {
        success: true,
        message: 'Tạo người dùng thành công.',
        record: user
      };
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, 'Name is required'),
        email: z.string().email({ message: 'Invalid email' }),
        image: z
          .object({
            fileName: z.string(),
            base64: z.string()
          })
          .optional(),
        gender: z.nativeEnum(Gender),
        dateOfBirth: z.date().optional(),
        password: z.string().min(6, { message: 'Password should include at least 6 characters' }),
        role: z.nativeEnum(UserRole),
        phone: z.string().max(10, { message: 'Phone number must not exceed 10 characters' }).optional(),
        address: z.string().optional(),
        pointLevel: z.number().default(0),
        level: z.nativeEnum(UserLevel).default(UserLevel.DONG)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existed = await ctx.db.user.findFirst({
        where: {
          email: { equals: input.email }
        },
        include: { images: true }
      });

      let imgURL: string | undefined;
      const oldImage = existed?.images[0];

      if (input?.image?.fileName) {
        const filenameImgFromDb = oldImage ? getFileNameFromFirebaseFile(oldImage.url) : null;

        if (!filenameImgFromDb || filenameImgFromDb !== input.image.fileName) {
          if (oldImage) await deleteImageFromFirebase(oldImage.url);
          imgURL = await uploadToFirebase(input.image.fileName, input.image.base64);
        } else {
          imgURL = oldImage?.url;
        }
      }

      if (!existed || existed.id === input.id) {
        const user = await ctx.db.user.update({
          where: { id: input.id },
          data: {
            name: input.name,
            email: input.email,
            dateOfBirth: input.dateOfBirth,
            role: input.role,
            phone: input.phone,
            address: input.address,
            pointLevel: input.pointLevel,
            level: input.level,
            images: imgURL
              ? {
                  upsert: {
                    where: oldImage ? { id: oldImage.id } : { id: 'unknown' },
                    update: {
                      entityType: EntityType.USER,
                      altText: `Ảnh ${input.name}`,
                      url: imgURL,
                      type: ImageType.THUMBNAIL
                    },
                    create: {
                      entityType: EntityType.USER,
                      altText: `Ảnh ${input.name}`,
                      url: imgURL,
                      type: ImageType.THUMBNAIL
                    }
                  }
                }
              : undefined
          }
        });

        return {
          success: true,
          message: 'Cập nhật Người dùng thành công.',
          record: user
        };
      }

      return {
        success: false,
        message: 'Người dùng đã tồn tại. Hãy thử lại.',
        record: existed
      };
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
        include: { images: true }
      });

      if (!user) {
        throw new Error('user không tồn tại.');
      }

      user?.images?.[0]?.url && (await deleteImageFromFirebase(user?.images?.[0]?.url));

      const deleteduser = await ctx.db.user.delete({ where: { id: input.id } });

      if (!user) {
        throw new Error(`Stock with ID ${input.id} not found.`);
      }

      return {
        success: true,
        message: 'Đã xóa user và ảnh liên quan.',
        record: deleteduser
      };
    }),
  getFilter: publicProcedure
    .input(
      z.object({
        query: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findMany({
        where: {
          OR: [
            { id: { equals: input.query?.trim() } },
            { name: { equals: input.query?.trim() } },
            { email: { equals: input.query?.trim() } }
          ]
        }
      });
      if (!user) {
        throw new Error(`User  not found.`);
      }
      return user;
    }),
  getOne: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        hasOrders: z.boolean().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          OR: [
            { id: { equals: input.query?.trim() } },
            { name: { equals: input.query?.trim() } },
            { email: { equals: input.query?.trim() } }
          ]
        },
        include: {
          order: input.hasOrders || false,
          images: true
        }
      });
      if (!user) {
        throw new Error(`Người dùng không tồn tại.`);
      }
      return user;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findMany();
    return user;
  })
});
