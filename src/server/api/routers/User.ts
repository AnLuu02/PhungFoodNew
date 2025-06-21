import { Gender, UserLevel } from '@prisma/client';
import { del, put } from '@vercel/blob';
import { compare } from 'bcryptjs';
import { randomInt } from 'crypto';
import { z } from 'zod';
import { UserRole } from '~/app/lib/utils/constants/roles';
import { getFileNameFromVercelBlob, tokenBlobVercel } from '~/app/lib/utils/func-handler/handle-file-upload';
import { hashPassword } from '~/app/lib/utils/func-handler/hashPassword';
import { getOtpEmail, sendEmail } from '~/app/lib/utils/func-handler/sendEmail';
import { LocalEntityType, LocalGender, LocalImageType, LocalUserLevel } from '~/app/lib/utils/zod/EnumType';
import { addressSchema } from '~/app/lib/utils/zod/zodShcemaForm';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const userRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { skip, take, s } = input;
      const startPageItem = skip > 0 ? (skip - 1) * take : 0;
      const [totalUsers, totalUsersQuery, users] = await ctx.db.$transaction([
        ctx.db.user.count(),
        ctx.db.user.count({
          where: {
            OR: [
              {
                name: { contains: s, mode: 'insensitive' }
              },
              {
                address: {
                  detail: { contains: s, mode: 'insensitive' }
                }
              },
              {
                phone: { contains: s, mode: 'insensitive' }
              },
              {
                email: { contains: s, mode: 'insensitive' }
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
                name: { contains: s, mode: 'insensitive' }
              },
              {
                address: {
                  detail: { contains: s, mode: 'insensitive' }
                }
              },
              {
                phone: { contains: s, mode: 'insensitive' }
              },
              {
                email: { contains: s, mode: 'insensitive' }
              }
            ]
          },
          include: {
            role: true
          }
        })
      ]);
      const totalPages = Math.ceil(s ? (totalUsersQuery == 0 ? 1 : totalUsersQuery / take) : totalUsers / take);
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
        gender: z.nativeEnum(Gender).default(LocalGender.OTHER),
        email: z.string().email({ message: 'Invalid email' }),
        image: z
          .object({
            fileName: z.string(),
            base64: z.string()
          })
          .optional(),
        dateOfBirth: z.date().optional(),
        password: z.string().min(6, { message: 'Password should include at least 6 characters' }),
        phone: z.string().max(10, { message: 'Phone number must not exceed 10 characters' }).optional(),
        address: addressSchema.optional(),
        pointLevel: z.number().default(0),
        level: z.nativeEnum(UserLevel).default(LocalUserLevel.BRONZE),
        roleId: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [existed, roles] = await ctx.db.$transaction([
        ctx.db.user.findFirst({
          where: {
            email: { equals: input.email }
          },
          include: {
            image: true
          }
        }),
        ctx.db.role.findMany({})
      ]);
      let defaultRole = roles.find(role => role.name === UserRole.CUSTOMER)?.id;
      if (input?.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN) {
        defaultRole = UserRole.SUPER_ADMIN;
      }
      if (existed) {
        return {
          success: false,
          message: 'Người dùng đã tồn tại. Hãy thử lại.',
          record: existed
        };
      }

      let imgURL: string | undefined;

      if (input?.image && input.image.fileName !== '') {
        if (input.image?.base64 !== '') {
          const buffer = Buffer.from(input.image.base64, 'base64');
          const blob = await put(input.image.fileName, buffer, { access: 'public', token: tokenBlobVercel });
          imgURL = blob.url;
        } else {
          imgURL = input.image.fileName;
        }
      }
      const passwordHash = await hashPassword(input.password);
      const user = await ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          gender: input.gender,
          dateOfBirth: input.dateOfBirth,
          password: passwordHash,
          phone: input.phone,
          address: input.address
            ? {
                create: input.address
              }
            : undefined,
          pointLevel: input.pointLevel,
          level: input.level,
          image: imgURL
            ? {
                create: {
                  entityType: LocalEntityType.USER,
                  altText: `Ảnh ${input.name}`,
                  url: imgURL,
                  type: LocalImageType.THUMBNAIL
                }
              }
            : undefined,
          role:
            input.roleId || input.email !== process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN || roles.length > 0
              ? {
                  connect: {
                    id: input.roleId || defaultRole
                  }
                }
              : {
                  create: {
                    name: UserRole.SUPER_ADMIN
                  }
                }
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
        gender: z.nativeEnum(Gender).default(LocalGender.OTHER),
        dateOfBirth: z.date().optional(),
        password: z.string().min(6, { message: 'Password should include at least 6 characters' }),
        phone: z.string().max(10, { message: 'Phone number must not exceed 10 characters' }).optional(),
        address: addressSchema,
        pointLevel: z.number().default(0),
        level: z.nativeEnum(UserLevel).default(LocalUserLevel.BRONZE),
        roleId: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existed = await ctx.db.user.findFirst({
        where: {
          email: { equals: input.email }
        },
        include: { image: true }
      });

      let imgURL: string | undefined;
      const oldImage = existed?.image;

      if (input?.image?.fileName) {
        const filenameImgFromDb = oldImage ? getFileNameFromVercelBlob(oldImage.url) : null;

        if (!filenameImgFromDb || filenameImgFromDb !== input.image.fileName) {
          if (oldImage) await del(oldImage.url, { token: tokenBlobVercel });
          const buffer = Buffer.from(input.image.base64, 'base64');
          const blob = await put(input.image.fileName, buffer, { access: 'public', token: tokenBlobVercel });
          imgURL = blob.url;
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
            phone: input.phone,
            gender: input.gender,
            address: {
              update: {
                ...input.address
              }
            },
            pointLevel: input.pointLevel,
            level: input.level,
            role: {
              connect: {
                id: input.roleId
              }
            },
            image: imgURL
              ? {
                  upsert: {
                    where: { id: oldImage?.id || '' },
                    update: {
                      entityType: LocalEntityType.USER,
                      altText: `Ảnh ${input.name}`,
                      url: imgURL,
                      type: LocalImageType.THUMBNAIL
                    },
                    create: {
                      entityType: LocalEntityType.USER,
                      altText: `Ảnh ${input.name}`,
                      url: imgURL,
                      type: LocalImageType.THUMBNAIL
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
        include: { image: true }
      });

      if (!user) {
        throw new Error('user không tồn tại.');
      }

      user?.image?.url && (await del(user?.image?.url, { token: tokenBlobVercel }));

      const deleteduser = await ctx.db.user.delete({ where: { id: input.id } });

      return {
        success: true,
        message: 'Đã xóa user và ảnh liên quan.',
        record: deleteduser
      };
    }),
  getFilter: publicProcedure
    .input(
      z.object({
        s: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findMany({
        where: {
          OR: [
            { id: { equals: input.s?.trim() } },
            { name: { equals: input.s?.trim() } },
            { email: { equals: input.s?.trim() } }
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
        s: z.string().optional(),
        hasOrders: z.boolean().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          OR: [
            { id: { equals: input.s?.trim() } },
            { name: { equals: input.s?.trim() } },
            { email: { equals: input.s?.trim() } }
          ]
        },
        include: {
          order: input.hasOrders || false,
          image: true,
          role: true,
          address: true
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
  }),

  requestPasswordReset: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email }
      });

      if (!user) {
        throw new Error('Email không tồn tại.');
      }

      const otp = randomInt(100000, 999999).toString();
      const now = new Date();
      const otpExpiry = new Date(now.getTime() + 1 * 60 * 1000);

      await ctx.db.user.update({
        where: { email: input.email },
        data: { resetToken: otp, resetTokenExpiry: otpExpiry }
      });

      const emailContent = getOtpEmail(otp);
      await sendEmail(input.email, 'Mã OTP đặt lại mật khẩu', emailContent);

      return { message: 'Mã OTP đã được gửi qua email!' };
    }),

  resetPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        token: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          email: input.email
        }
      });
      if (!user) {
        throw new Error('Email không tồn tại');
      }

      const isTokenValid = await compare(user.resetToken || '', input.token);

      if (!isTokenValid) {
        throw new Error('OTP không hợp lệ hoặc đã hết hạn.');
      }

      const hashedPassword = await hashPassword(input.password);

      await ctx.db.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null
        }
      });

      return { message: 'Mật khẩu đã được đặt lại.' };
    }),

  verifyOtp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        otp: z.string().length(6)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          email: input.email,
          resetToken: input.otp,
          resetTokenExpiry: { gte: new Date() }
        }
      });

      if (!user) {
        throw new Error('OTP không hợp lệ hoặc đã hết hạn.');
      }

      return { sussess: true };
    })
});
