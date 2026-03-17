import { EntityType, ImageType, Prisma, PrismaClient, TokenType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { del, put } from '@vercel/blob';
import { compare, hash } from 'bcryptjs';
import crypto, { randomInt } from 'crypto';
import dayjs from 'dayjs';
import { Session } from 'next-auth';
import { regexCheckGuest } from '~/lib/FuncHandler/generateGuestCredentials';
import { getFileNameFromVercelBlob, tokenBlobVercel } from '~/lib/FuncHandler/handle-file-base64';
import { getOtpEmail, sendEmail } from '~/lib/FuncHandler/MailHelpers/sendEmail';
import { buildSortFilter } from '~/lib/FuncHandler/PrismaHelper';
import { UserRole } from '~/shared/constants/user';
import { UserReq } from '~/shared/schema/user.schema';
import { db } from '../db';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 15;

export async function handleUserLock(user: any) {
  if (!user?.isLocked || !user?.lockedUntil) return user;

  const now = dayjs();
  const lockedUntil = dayjs(user.lockedUntil);

  if (now.isAfter(lockedUntil)) {
    const resp = await updateUserCustomService(db, {
      where: { email: user.email },
      data: {
        isLocked: false,
        failedAttempts: 0,
        lockedUntil: null
      }
    });
    if (!resp) throw new Error('Đã có lỗi xảy ra trong quá trình xử lí trạng thái người dùng.');
    return resp;
  }

  const remainingSeconds = lockedUntil.diff(now, 'second');
  const remainingMinutes = Math.ceil(remainingSeconds / 60);
  const text = remainingMinutes <= 0 ? '<1' : remainingMinutes.toString();

  throw new Error(`Tài khoản bị khóa. Vui lòng thử lại sau ${text} phút.`);
}

export async function handleFailedLogin(user: any) {
  const attempts = user.failedAttempts + 1;
  if (attempts >= MAX_FAILED_ATTEMPTS) {
    await updateUserCustomService(db, {
      where: { id: user.id },
      data: {
        isLocked: true,
        failedAttempts: attempts,
        lockedUntil: new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000)
      }
    });
    throw new Error('Tài khoản bị khóa tạm thời do quá nhiều lần đăng nhập sai.');
  }

  await updateUserCustomService(db, {
    where: { id: user.id },
    data: { failedAttempts: attempts }
  });

  throw new Error(`Mật khẩu sai không hợp lệ. Còn lại (${attempts}/${MAX_FAILED_ATTEMPTS}) lần.`);
}

export const hashPassword = async (password: string) => {
  const saltRounds = 10;
  const hashedPassword = await hash(password, saltRounds);
  return hashedPassword;
};

export const hashOTP = (otp: string) => {
  const salt = process.env.OTP_SALT || 'default-salt';
  return crypto
    .createHash('sha256')
    .update(otp + salt)
    .digest('hex');
};

export const createOTP = (timeExpiredMinutes = 3) => {
  const now = dayjs();
  const otp = randomInt(100000, 999999).toString();
  const otpExpired = now.add(timeExpiredMinutes, 'minute').toDate();
  const otpHash = hashOTP(otp);
  return {
    otp,
    otpExpired,
    otpHash
  };
};

// fetch
export const findUserService = async (
  db: PrismaClient,
  input: {
    skip: number;
    take: number;
    s?: string;
    sort?: string[];
    filter?: string;
  }
) => {
  const { skip, take, s, sort, filter } = input;
  const startPageItem = skip > 0 ? (skip - 1) * take : 0;
  const [totalUsers, totalUsersQuery, users] = await db.$transaction([
    db.user.count(),
    db.user.count({
      where: {
        AND: {
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
          ],
          isActive: filter?.includes('ACTIVE@#@$@@') ? true : filter?.includes('INACTIVE@#@$@@') ? false : undefined,
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
    db.user.findMany({
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
                detail: { contains: s, mode: 'insensitive' }
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
        role: true,
        address: true
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
};
export const createUserService = async (db: PrismaClient, input: UserReq, session: Session | null) => {
  const [existed, roles] = await db.$transaction([
    db.user.findFirst({
      where: {
        email: input.email
      },
      include: {
        image: true
      }
    }),
    db.role.findMany({})
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
  if (existed) {
    if (!existed.isActive) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Email này đã bị vô hiệu hóa.'
      });
    }
    if (existed.isVerified) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Người dùng đã tồn tại. Hãy thử lại.'
      });
    } else {
      throw new TRPCError({
        code: 'NOT_IMPLEMENTED',
        message: 'Tài khoản đã đăng kích nhưng chưa kích hoạt.'
      });
    }
  }

  let imgURL: string | undefined;

  if (input?.image && input.image.fileName) {
    if (input.image?.base64) {
      const buffer = Buffer.from(input.image.base64, 'base64');
      const blob = await put(input.image.fileName, buffer, { access: 'public', token: tokenBlobVercel });
      imgURL = blob.url;
    } else {
      imgURL = input.image.fileName;
    }
  }
  let otpExpired = dayjs().toDate(),
    otpHash = '',
    otp = '';
  if (!regexCheckGuest.test(input.email) && session?.user?.email !== process.env.NEXT_PUBLIC_EMAIL_ADMIN) {
    ({ otp, otpExpired, otpHash } = createOTP());
    const emailContent = getOtpEmail(otp, input, 3);
    await sendEmail(input.email, 'Mã OTP kích hoạt tài khoản', emailContent);
  }
  const passwordHash = await hashPassword(input.password);
  const user = await db.user.create({
    data: {
      name: input.name,
      email: input.email,
      gender: input.gender,
      dateOfBirth: input.dateOfBirth,
      isActive: input.isActive,
      isVerified: regexCheckGuest.test(input.email) ? true : false,
      password: passwordHash,
      phone: input.phone,
      tokens: otpHash
        ? {
            create: {
              tokenHash: otpHash,
              expires: otpExpired,
              type: 'EMAIL_VERIFICATION'
            }
          }
        : undefined,
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
              entityType: EntityType.USER,
              altText: `Ảnh ${input.name}`,
              url: imgURL,
              type: ImageType.THUMBNAIL
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

  return user;
};
export const updateUserService = async (db: PrismaClient, input: any) => {
  const existed = await db.user.findFirst({
    where: {
      email: input.email
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
    const user = await db.user.update({
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
          : oldImage?.url && input.image?.fileName === ''
            ? {
                delete: {
                  id: oldImage?.id || ''
                }
              }
            : undefined
      }
    });
    return user;
  }

  throw new TRPCError({
    code: 'CONFLICT',
    message: 'Người dùng đã tồn tại. Hãy thử lại.'
  });
};
export const updateUserCustomService = async (db: PrismaClient, input: { where: any; data: any }) => {
  const { where, data } = input;
  const existed = await db.user.findFirst({
    where: where as Prisma.UserWhereUniqueInput,
    include: { image: true }
  });

  let imgURL: string | undefined;
  const oldImage = existed?.image;

  if (data?.image?.fileName) {
    const filenameImgFromDb = oldImage ? getFileNameFromVercelBlob(oldImage.url) : null;
    if (data.image?.base64) {
      if (!filenameImgFromDb || filenameImgFromDb !== data.image.fileName) {
        if (oldImage) await del(oldImage.url, { token: tokenBlobVercel });
        const buffer = Buffer.from(data.image.base64, 'base64');
        const blob = await put(data.image.fileName, buffer, { access: 'public', token: tokenBlobVercel });
        imgURL = blob.url;
      } else {
        imgURL = oldImage?.url;
      }
    } else {
      imgURL = data.image.fileName;
    }
  }

  if (oldImage && oldImage.url && data.image?.fileName === '') {
    await del(oldImage.url, { token: tokenBlobVercel });
  }

  const user = await db.user.update({
    where: where as Prisma.UserWhereUniqueInput,
    data: {
      ...data,
      image: imgURL
        ? {
            upsert: {
              where: { id: oldImage?.id || '' },
              update: {
                entityType: EntityType.USER,
                altText: `Ảnh ${data.name}`,
                url: imgURL,
                type: ImageType.THUMBNAIL
              },
              create: {
                entityType: EntityType.USER,
                altText: `Ảnh ${data.name}`,
                url: imgURL,
                type: ImageType.THUMBNAIL
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
  return user;
};
export const deleteUserService = async (db: PrismaClient, input: { id: string }) => {
  const user = await db.user.findUnique({
    where: { id: input.id },
    include: { image: true }
  });

  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Ngươi dùng không tồn tại. Hãy thử lại.'
    });
  }

  user?.image?.url && (await del(user?.image?.url, { token: tokenBlobVercel }));

  const deleteduser = await db.user.delete({ where: { id: input.id } });

  return deleteduser;
};
export const getFilterUserService = async (db: PrismaClient, input: { s: string }) => {
  const user = await db.user.findMany({
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
  return user;
};
export const getSellerService = async (db: PrismaClient) => {
  const user = await db.user.findMany({
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
  return user;
};
export const getOneUserService = async (db: PrismaClient, input: { s?: string; hasOrders?: boolean }) => {
  const user = await db.user.findFirst({
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
    return null;
  }
  return {
    ...user,
    role: {
      ...user.role,
      permissions: permissionsFinal
    }
  };
};

export const getNotGuestService = async (db: PrismaClient) => {
  const user = await db.user.findMany({
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
};
export const verifyEmailService = async (
  db: PrismaClient,
  input: {
    email: string;
    timeExpiredMinutes: number | 3;
    type: TokenType;
  }
) => {
  const { email, timeExpiredMinutes, type } = input;
  const user = await db.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Email không tồn tại.'
    });
  }

  const now = dayjs();
  const lockedUntil = dayjs(user.lockedUntil);
  if (user.isLocked && now.isBefore(lockedUntil)) {
    const remainingSeconds = lockedUntil.diff(now, 'second');
    const remainingMinutes = Math.ceil(remainingSeconds / 60);
    const text = remainingMinutes <= 0 ? '<1' : remainingMinutes.toString();
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: `Tài khoản tạm thời bị khóa. Thử lại sau ${text} phút.`
    });
  }
  const { otp, otpExpired, otpHash } = createOTP();
  await db.token.upsert({
    where: {
      email_type: {
        email,
        type
      }
    },
    create: {
      email,
      expires: otpExpired,
      tokenHash: otpHash,
      type
    },
    update: {
      email,
      expires: otpExpired,
      tokenHash: otpHash,
      type
    }
  });
  const emailContent = getOtpEmail(otp, user, timeExpiredMinutes);
  await sendEmail(email, 'Mã OTP đặt lại mật khẩu', emailContent);
  return user;
};
export const resetPasswordService = async (
  db: PrismaClient,
  input: {
    email: string;
    password: string;
    token: string;
  }
) => {
  const token = await db.token.findUnique({
    where: {
      email: input.email,
      tokenHash: input.token
    },
    include: {
      user: true
    }
  });
  if (!token) {
    throw new TRPCError({
      code: 'TIMEOUT',
      message: 'Mã OTP không hợp lệ.'
    });
  }

  const isTokenValid = dayjs(token.expires).isAfter(dayjs());

  if (!isTokenValid) {
    throw new TRPCError({
      code: 'TIMEOUT',
      message: 'Mã OTP đã hết hạn.'
    });
  }

  const isSameAsCurrent = await compare(input.password, token.user.password);
  if (isSameAsCurrent) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Gần đây bạn đã sử dụng mật khẩu này. Vui lòng sử dụng mật khẩu khác.'
    });
  }

  const hashedPassword = await hashPassword(input.password);

  await db.user.update({
    where: { id: token.user.id },
    data: {
      password: hashedPassword,
      tokens: {
        delete: {
          id: token.id
        }
      }
    }
  });
  const { password, ...rest } = token.user;
  return rest;
};

export const verifyOtpService = async (db: PrismaClient, input: { email: string; otp?: string; token?: string }) => {
  const { email, otp, token } = input;
  const now = dayjs().toDate();
  const otpHash = otp && !token ? hashOTP(otp) : token;
  const resp = await db.token.findUnique({
    where: {
      email,
      tokenHash: otpHash,
      expires: {
        gt: now
      }
    },
    include: {
      user: true
    }
  });

  if (!resp) {
    throw new TRPCError({
      code: 'TIMEOUT',
      message: 'OTP không hợp lệ hoặc đã hết hạn.'
    });
  }
  const { password, ...rest } = resp.user;
  return {
    ...resp,
    user: { ...rest }
  };
};
