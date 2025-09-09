import { Gender, UserLevel } from '@prisma/client';
import { del, put } from '@vercel/blob';
import { compare } from 'bcryptjs';
import { randomInt } from 'crypto';
import { z } from 'zod';
import { UserRole } from '~/constants';
import { getFileNameFromVercelBlob, tokenBlobVercel } from '~/lib/func-handler/handle-file-base64';
import { hashPassword } from '~/lib/func-handler/hashPassword';
import { getOtpEmail, sendEmail } from '~/lib/func-handler/sendEmail';
import { LocalEntityType, LocalGender, LocalImageType, LocalUserLevel } from '~/lib/zod/EnumType';
import { addressSchema } from '~/lib/zod/zodShcemaForm';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { ResponseTRPC } from '~/types/ResponseFetcher';

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
        name: z.string().min(1, 'Tên không được để trống'),
        gender: z.nativeEnum(Gender).default(LocalGender.OTHER),
        email: z.string().email({ message: 'Email không hợp lệ' }),
        image: z
          .object({
            fileName: z.string(),
            base64: z.string()
          })
          .optional(),
        dateOfBirth: z.date().optional(),
        password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
        phone: z.string().max(10, { message: 'Số điện thoại phải có 10 chữ số' }).optional(),
        address: addressSchema.optional(),
        pointUser: z.number().default(0),
        level: z.nativeEnum(UserLevel).default(LocalUserLevel.BRONZE),
        roleId: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
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
      let defaultRole;
      if (roles.length > 0) {
        if (input.roleId) {
          defaultRole = { id: input.roleId };
        } else if (input?.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN) {
          defaultRole = roles.find(role => role.name === UserRole.SUPER_ADMIN);
        } else {
          defaultRole = roles.find(role => role.name === UserRole.CUSTOMER);
        }
      }
      if (existed) {
        return {
          code: 'CONFLICT',
          message: 'Người dùng đã tồn tại. Hãy thử lại.',
          data: existed
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
          pointUser: input.pointUser,
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
            roles.length > 0
              ? {
                  connect: {
                    id: defaultRole?.id
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
        code: 'OK',
        message: 'Tạo người dùng thành công.',
        data: user
      };
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, 'Tên không được để trống'),
        email: z.string().email({ message: 'Email không hợp lệ' }),
        image: z
          .object({
            fileName: z.string(),
            base64: z.string()
          })
          .optional(),
        gender: z.nativeEnum(Gender).default(LocalGender.OTHER),
        dateOfBirth: z.date().optional(),
        password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
        phone: z.string().max(10, { message: 'Số điện thoại phải có 10 chữ số' }).optional(),
        address: addressSchema,
        pointUser: z.number().default(0),
        level: z.nativeEnum(UserLevel).default(LocalUserLevel.BRONZE),
        roleId: z.string()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
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

      if (oldImage && oldImage.url && input.image?.fileName === '') {
        await del(oldImage.url, { token: tokenBlobVercel });
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
              upsert: {
                create: {
                  ...input.address
                },
                update: {
                  ...input.address
                }
              }
            },
            pointUser: input.pointUser,
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
              : oldImage?.url && input.image?.fileName === ''
                ? {
                    delete: {
                      id: oldImage?.id || ''
                    }
                  }
                : undefined
          }
        });
        return {
          code: 'OK',
          message: 'Cập nhật Người dùng thành công.',
          data: user
        };
      }

      return {
        code: 'CONFLICT',
        message: 'Người dùng đã tồn tại. Hãy thử lại.',
        data: existed
      };
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
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
        code: 'OK',
        message: 'Đã xóa user và ảnh liên quan.',
        data: deleteduser
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
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
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

      return { code: 'OK', message: 'Mã OTP đã được gửi qua email!', data: user };
    }),

  resetPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        token: z.string()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
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

      return { code: 'OK', message: 'Mật khẩu đã được đặt lại.', data: user };
    }),

  verifyOtp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        otp: z.string().length(6)
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
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

      return { code: 'OK', message: 'OTP hợp lệ.', data: user };
    })
});
