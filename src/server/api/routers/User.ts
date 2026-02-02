import { Prisma } from '@prisma/client';
import { del, put } from '@vercel/blob';
import { compare } from 'bcryptjs';
import { randomInt } from 'crypto';
import { z } from 'zod';
import { UserRole } from '~/constants';
import { regexCheckGuest } from '~/lib/FuncHandler/generateGuestCredentials';
import { getFileNameFromVercelBlob, tokenBlobVercel } from '~/lib/FuncHandler/handle-file-base64';
import { hashPassword } from '~/lib/FuncHandler/hashPassword';
import { getOtpEmail, sendEmail } from '~/lib/FuncHandler/MailHelpers/sendEmail';
import { buildSortFilter } from '~/lib/FuncHandler/PrismaHelper';
import { LocalEntityType, LocalImageType } from '~/lib/ZodSchema/enum';
import { imageReqSchema, userSchema } from '~/lib/ZodSchema/schema';

import { createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import { ResponseTRPC } from '~/types/ResponseFetcher';

export const userRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional(),
        sort: z.array(z.string()).optional(),
        filter: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { skip, take, s, sort, filter } = input;
      const startPageItem = skip > 0 ? (skip - 1) * take : 0;
      const [totalUsers, totalUsersQuery, users] = await ctx.db.$transaction([
        ctx.db.user.count(),
        ctx.db.user.count({
          where: {
            AND: {
              OR: [
                {
                  name: { contains: s, mode: 'insensitive' }
                },
                {
                  address: {
                    some: {
                      detail: { contains: s, mode: 'insensitive' }
                    }
                  }
                },
                {
                  phone: { contains: s, mode: 'insensitive' }
                },
                {
                  email: { contains: s, mode: 'insensitive' }
                }
              ],
              isActive: filter?.includes('ACTIVE@#@$@@')
                ? true
                : filter?.includes('INACTIVE@#@$@@')
                  ? false
                  : undefined,
              role: {
                name: filter?.includes('STAFF@#@$@@')
                  ? 'STAFF'
                  : filter?.includes('CUSTOMER@#@$@@')
                    ? 'CUSTOMER'
                    : undefined
              }
            }
          },
          orderBy: sort && sort?.length > 0 ? buildSortFilter(sort, ['pointUser', 'name']) : undefined
        }),
        ctx.db.user.findMany({
          skip: startPageItem,
          take,
          where: {
            AND: {
              OR: [
                {
                  name: { contains: s, mode: 'insensitive' }
                },
                {
                  address: {
                    some: {
                      detail: { contains: s, mode: 'insensitive' }
                    }
                  }
                },
                {
                  phone: { contains: s, mode: 'insensitive' }
                },
                {
                  email: { contains: s, mode: 'insensitive' }
                }
              ],
              isActive: filter === 'ACTIVE@#@$@@' ? true : filter === 'INACTIVE@#@$@@' ? false : undefined,
              role: {
                name: filter?.includes('STAFF@#@$@@')
                  ? 'STAFF'
                  : filter?.includes('CUSTOMER@#@$@@')
                    ? 'CUSTOMER'
                    : undefined
              }
            }
          },
          orderBy: sort && sort?.length > 0 ? buildSortFilter(sort, ['pointUser', 'name']) : undefined,
          include: {
            role: true
          }
        })
      ]);
      const totalPages = Math.ceil(
        Object.entries(input)?.length > 2 ? (totalUsersQuery == 0 ? 1 : totalUsersQuery / take) : totalUsers / take
      );
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
    .input(userSchema.extend({ image: imageReqSchema }))
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
        } else if (input?.email === process.env.NEXT_PUBLIC_EMAIL_ADMIN) {
          defaultRole = roles.find(role => role.name === UserRole.ADMIN);
        } else {
          defaultRole = roles.find(role => role.name === UserRole.CUSTOMER);
        }
      }
      if (existed && existed.isVerified) {
        return {
          code: 'CONFLICT',
          message: 'Người dùng đã tồn tại. Hãy thử lại.',
          data: existed
        };
      }

      if (existed && !existed.isActive) {
        return {
          code: 'FORBIDDEN',
          message: 'Email này đã bị vô hiệu hóa.',
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
      let otp = null,
        otpExpiry = null;
      if (!regexCheckGuest.test(input.email)) {
        const now = new Date();
        otp = randomInt(100000, 999999).toString();
        otpExpiry = new Date(now.getTime() + 3 * 60 * 1000);
        const emailContent = getOtpEmail(otp, input, 3);
        await sendEmail(input.email, 'Mã OTP kích hoạt tài khoản', emailContent);
      }
      const passwordHash = await hashPassword(input.password);
      const user = await ctx.db.user.create({
        data: {
          resetToken: otp,
          resetTokenExpiry: otpExpiry,
          name: input.name,
          email: input.email,
          gender: input.gender,
          dateOfBirth: input.dateOfBirth,
          isActive: input.isActive,
          isVerified: regexCheckGuest.test(input.email) ? true : false,
          password: passwordHash,
          phone: input.phone,
          address: input.address
            ? ({
                create: input.address
              } as any)
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
                    name: UserRole.ADMIN
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
    .use(requirePermission('update:user'))
    .input(userSchema.extend({ image: imageReqSchema }))
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
            isActive: input.isActive,
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
              } as any
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
  updateCustom: publicProcedure
    .input(
      z.object({
        where: z.record(z.any()),
        data: z.record(z.any())
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const { where, data } = input;
      const existed = await ctx.db.user.findFirst({
        where: where as Prisma.UserWhereUniqueInput,
        include: { image: true }
      });

      let imgURL: string | undefined;
      const oldImage = existed?.image;

      if (data?.image?.fileName) {
        const filenameImgFromDb = oldImage ? getFileNameFromVercelBlob(oldImage.url) : null;

        if (!filenameImgFromDb || filenameImgFromDb !== data.image.fileName) {
          if (oldImage) await del(oldImage.url, { token: tokenBlobVercel });
          const buffer = Buffer.from(data.image.base64, 'base64');
          const blob = await put(data.image.fileName, buffer, { access: 'public', token: tokenBlobVercel });
          imgURL = blob.url;
        } else {
          imgURL = oldImage?.url;
        }
      }

      if (oldImage && oldImage.url && data.image?.fileName === '') {
        await del(oldImage.url, { token: tokenBlobVercel });
      }

      const user = await ctx.db.user.update({
        where: where as Prisma.UserWhereUniqueInput,
        data: {
          ...data,
          image: imgURL
            ? {
                upsert: {
                  where: { id: oldImage?.id || '' },
                  update: {
                    entityType: LocalEntityType.USER,
                    altText: `Ảnh ${data.name}`,
                    url: imgURL,
                    type: LocalImageType.THUMBNAIL
                  },
                  create: {
                    entityType: LocalEntityType.USER,
                    altText: `Ảnh ${data.name}`,
                    url: imgURL,
                    type: LocalImageType.THUMBNAIL
                  }
                }
              }
            : oldImage?.url && data.image?.fileName === ''
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
    }),
  delete: publicProcedure
    .use(requirePermission('delete:user'))
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
            { email: { equals: input.s?.trim() } },
            {
              role: {
                name: { equals: input.s?.trim() }
              }
            }
          ]
        }
      });
      if (!user) {
        throw new Error(`User  not found.`);
      }
      return user;
    }),
  getSaler: publicProcedure.query(async ({ ctx, input }) => {
    const user = await ctx.db.user.findMany({
      where: {
        role: {
          name: {
            not: 'CUSTOMER',
            mode: 'insensitive'
          }
        }
      },
      include: {
        role: {
          select: {
            id: true,
            name: true
          }
        }
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
          orders: input.hasOrders || false,
          image: true,
          role: {
            include: {
              permissions: true
            }
          },
          userPermissions: {
            include: {
              permission: true
            }
          },
          address: true
        }
      });
      const rolePermissions = user?.role?.permissions || [];
      const overrides = user?.userPermissions || [];

      const finalSet = new Set(rolePermissions.map(p => p.id));

      for (const up of overrides) {
        if (up.granted) {
          finalSet.add(up.permissionId);
        } else {
          finalSet.delete(up.permissionId);
        }
      }

      const permissionsFinal = [
        ...rolePermissions.filter(p => finalSet.has(p.id)),
        ...overrides
          .filter(up => up.granted && !rolePermissions.some(p => p.id === up.permissionId))
          .map(up => up.permission)
      ];

      if (!user) {
        throw new Error(`Người dùng không tồn tại.`);
      }
      return {
        ...user,
        role: {
          ...user.role,
          permissions: permissionsFinal
        }
      };
    }),
  updateAny: publicProcedure
    .input(
      z.object({
        where: z.record(z.any()),
        data: z.record(z.any())
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { where, data } = input;
      const user = await ctx.db.user.update({
        where: where as Prisma.UserWhereUniqueInput,
        data: data as Prisma.UserUpdateInput
      });
      return {
        code: 'OK',
        message: 'Cập nhật người dùng.',
        data: user
      };
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findMany({ include: { role: true } });
    return user;
  }),
  getNotGuest: publicProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findMany({
      where: {
        email: {
          not: {
            startsWith: 'guest_'
          }
        }
      },
      include: { role: true }
    });
    return user;
  }),
  verifyEmail: publicProcedure
    .input(z.object({ email: z.string().email(), timeExpiredMinutes: z.number().default(3) }))
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email }
      });

      if (!user) {
        throw new Error('Email không tồn tại.');
      }

      const otp = randomInt(100000, 999999).toString();
      const now = new Date();
      const otpExpiry = new Date(now.getTime() + (input.timeExpiredMinutes || 3) * 60 * 1000);
      await ctx.db.user.update({
        where: { email: input.email },
        data: { resetToken: otp, resetTokenExpiry: otpExpiry }
      });

      const emailContent = getOtpEmail(otp, user, input.timeExpiredMinutes || 3);
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

      const isTokenValid =
        (await compare(user.resetToken || '', input.token)) && (user.resetTokenExpiry || new Date()) > new Date();

      if (!isTokenValid) {
        throw new Error('OTP không hợp lệ hoặc đã hết hạn.');
      }

      const isSameAsCurrent = await compare(input.password, user.password);
      if (isSameAsCurrent) {
        throw new Error('Gần đây bạn đã sử dụng mật khẩu này. Vui lòng sử dụng mật khẩu khác.');
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
      const now = new Date();
      const user = await ctx.db.user.findFirst({
        where: {
          email: input.email,
          resetToken: input.otp,
          resetTokenExpiry: { gte: now }
        }
      });

      if (!user) {
        throw new Error('OTP không hợp lệ hoặc đã hết hạn.');
      }

      return { code: 'OK', message: 'OTP hợp lệ.', data: user };
    })
});
